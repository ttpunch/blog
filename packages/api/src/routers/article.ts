import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { ArticleStatus } from '@prisma/client';

export const articleRouter = router({
    // Get all published articles (public)
    list: publicProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(50).default(10),
                cursor: z.string().nullish(),
                category: z.string().optional(),
                tag: z.string().optional(),
            })
        )
        .query(async ({ ctx, input }) => {
            const items = await ctx.prisma.article.findMany({
                take: input.limit + 1,
                cursor: input.cursor ? { id: input.cursor } : undefined,
                where: {
                    status: ArticleStatus.PUBLISHED,
                    ...(input.category && { category: { slug: input.category } }),
                    ...(input.tag && { tags: { some: { slug: input.tag } } }),
                },
                include: {
                    category: true,
                    tags: true,
                    _count: {
                        select: {
                            likes: true,
                            comments: true,
                        },
                    },
                },
                orderBy: { publishedAt: 'desc' },
            });

            let nextCursor: typeof input.cursor = undefined;
            if (items.length > input.limit) {
                const nextItem = items.pop();
                nextCursor = nextItem!.id;
            }

            return { items, nextCursor };
        }),

    // Get single article by slug (public)
    bySlug: publicProcedure
        .input(z.object({ slug: z.string() }))
        .query(async ({ ctx, input }) => {
            const article = await ctx.prisma.article.findUnique({
                where: { slug: input.slug },
                include: {
                    category: true,
                    tags: true,
                    _count: {
                        select: {
                            likes: true,
                            comments: true,
                        },
                    },
                },
            });

            if (!article) {
                throw new Error('Article not found');
            }

            // Increment view count
            await ctx.prisma.article.update({
                where: { id: article.id },
                data: { viewCount: { increment: 1 } },
            });

            return article;
        }),

    // Get article by ID (protected)
    getById: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            return ctx.prisma.article.findUnique({
                where: { id: input.id },
                include: {
                    category: true,
                    tags: true,
                },
            });
        }),

    getBySlug: publicProcedure
        .input(z.object({ slug: z.string() }))
        .query(async ({ ctx, input }) => {
            return ctx.prisma.article.findUnique({
                where: { slug: input.slug },
                include: {
                    category: true,
                    tags: true,
                },
            });
        }),

    // Get articles for review queue (admin)
    reviewQueue: protectedProcedure.query(async ({ ctx }) => {
        return ctx.prisma.article.findMany({
            where: { status: ArticleStatus.REVIEW },
            include: { category: true, tags: true },
            orderBy: { createdAt: 'desc' },
        });
    }),

    // Get all articles for admin (any status)
    adminList: protectedProcedure
        .input(
            z.object({
                status: z.enum(['DRAFT', 'QUEUED', 'RESEARCHING', 'WRITING', 'OPTIMIZING', 'REVIEW', 'PUBLISHED', 'REJECTED']).optional(),
            })
        )
        .query(async ({ ctx, input }) => {
            return ctx.prisma.article.findMany({
                where: input.status ? { status: input.status as any } : {},
                include: {
                    category: true,
                    tags: true,
                    _count: {
                        select: {
                            likes: true,
                            comments: true,
                        },
                    },
                },
                orderBy: { updatedAt: 'desc' },
            });
        }),

    // Create article
    create: protectedProcedure
        .input(
            z.object({
                title: z.string().min(1),
                slug: z.string().min(1),
                excerpt: z.string().optional(),
                content: z.string(),
                coverImage: z.string().optional(),
                categoryId: z.string().optional(),
                tagIds: z.array(z.string()).optional(),
                status: z.enum(['DRAFT', 'QUEUED', 'RESEARCHING', 'WRITING', 'OPTIMIZING', 'REVIEW', 'PUBLISHED', 'REJECTED']).default('QUEUED'),
                aiGenerated: z.boolean().default(false),
                aiProvider: z.string().optional(),
                aiModel: z.string().optional(),
                aiPrompt: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { tagIds, categoryId, ...data } = input;
            const sanitizedCategoryId = categoryId === '' ? null : categoryId;

            // Reading time calculation
            const readingTime = Math.ceil(input.content.split(/\s+/).length / 200);

            return ctx.prisma.article.create({
                data: {
                    ...data,
                    categoryId: sanitizedCategoryId,
                    status: data.status as any,
                    readingTime,
                    ...(tagIds ? {
                        tags: { connect: tagIds.map((id) => ({ id })) },
                    } : {}),
                },
            });
        }),

    // Update article
    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                title: z.string().optional(),
                slug: z.string().optional(),
                excerpt: z.string().optional(),
                content: z.string().optional(),
                coverImage: z.string().optional(),
                categoryId: z.string().nullable().optional(),
                tagIds: z.array(z.string()).optional(),
                status: z.enum(['DRAFT', 'QUEUED', 'RESEARCHING', 'WRITING', 'OPTIMIZING', 'REVIEW', 'PUBLISHED', 'REJECTED']).optional(),
                metaTitle: z.string().optional(),
                metaDescription: z.string().optional(),
                seoScore: z.number().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { id, tagIds, categoryId, ...data } = input;
            const sanitizedCategoryId = categoryId === '' ? null : categoryId;

            // Calculate reading time if content changed
            const updateData: any = { ...data, categoryId: sanitizedCategoryId };
            if (data.content && typeof data.content === 'string') {
                updateData.readingTime = Math.ceil(data.content.split(/\s+/).length / 200);
            }

            // Set publishedAt when publishing
            if (data.status === 'PUBLISHED') {
                updateData.publishedAt = new Date();
            }

            if (updateData.status) {
                updateData.status = updateData.status as any;
            }

            return ctx.prisma.article.update({
                where: { id },
                data: {
                    ...updateData,
                    ...(tagIds ? {
                        tags: { set: tagIds.map((id) => ({ id })) },
                    } : {}),
                },
            });
        }),

    // Delete article
    delete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.prisma.article.delete({
                where: { id: input.id },
            });
        }),

    // Approve article (move to published)
    approve: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.prisma.article.update({
                where: { id: input.id },
                data: {
                    status: ArticleStatus.PUBLISHED,
                    publishedAt: new Date(),
                },
            });
        }),

    // Reject article
    reject: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.prisma.article.update({
                where: { id: input.id },
                data: { status: ArticleStatus.REJECTED },
            });
        }),
});
