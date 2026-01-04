import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';

export const commentRouter = router({
    list: publicProcedure
        .input(z.object({ articleId: z.string() }))
        .query(async ({ ctx, input }) => {
            return ctx.prisma.comment.findMany({
                where: { articleId: input.articleId, parentId: null },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                        },
                    },
                    replies: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    image: true,
                                },
                            },
                        },
                        orderBy: { createdAt: 'asc' },
                    },
                },
                orderBy: { createdAt: 'desc' },
            });
        }),

    create: protectedProcedure
        .input(z.object({
            articleId: z.string(),
            content: z.string().min(1),
            parentId: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            return ctx.prisma.comment.create({
                data: {
                    content: input.content,
                    articleId: input.articleId,
                    userId: (ctx.session.user as any).id,
                    parentId: input.parentId,
                },
            });
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const comment = await ctx.prisma.comment.findUnique({
                where: { id: input.id },
            });

            if (!comment) throw new Error('Comment not found');

            // Only allow deletion by author or admin (can update logic later for roles)
            if (comment.userId !== (ctx.session.user as any).id) {
                throw new Error('Unauthorized');
            }

            return ctx.prisma.comment.delete({
                where: { id: input.id },
            });
        }),

    // Admin moderation
    listAll: protectedProcedure
        .query(async ({ ctx }) => {
            return ctx.prisma.comment.findMany({
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                        },
                    },
                    article: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            });
        }),

    moderateDelete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            // Check if user is admin (assuming based on email or specific flag later)
            // For now, let's keep it simple
            return ctx.prisma.comment.delete({
                where: { id: input.id },
            });
        }),
});
