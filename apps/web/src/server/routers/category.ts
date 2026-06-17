import { z } from 'zod';
import { router, publicProcedure, adminProcedure } from '../trpc';

export const categoryRouter = router({
    // List all categories
    list: publicProcedure.query(async ({ ctx }) => {
        return ctx.prisma.category.findMany({
            include: {
                _count: { select: { articles: true } },
            },
            orderBy: { name: 'asc' },
        });
    }),

    // Get category by slug
    bySlug: publicProcedure
        .input(z.object({ slug: z.string() }))
        .query(async ({ ctx, input }) => {
            return ctx.prisma.category.findUnique({
                where: { slug: input.slug },
                include: {
                    _count: { select: { articles: true } },
                },
            });
        }),

    // Create category
    create: adminProcedure
        .input(
            z.object({
                name: z.string().min(1),
                slug: z.string().min(1),
                description: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return ctx.prisma.category.create({ data: input });
        }),

    // Update category
    update: adminProcedure
        .input(
            z.object({
                id: z.string(),
                name: z.string().optional(),
                slug: z.string().optional(),
                description: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { id, ...data } = input;
            return ctx.prisma.category.update({ where: { id }, data });
        }),

    // Delete category
    delete: adminProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.prisma.category.delete({ where: { id: input.id } });
        }),
});

export const tagRouter = router({
    // List all tags
    list: publicProcedure.query(async ({ ctx }) => {
        return ctx.prisma.tag.findMany({
            include: {
                _count: { select: { articles: true } },
            },
            orderBy: { name: 'asc' },
        });
    }),

    // Create tag
    create: adminProcedure
        .input(
            z.object({
                name: z.string().min(1),
                slug: z.string().min(1),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return ctx.prisma.tag.create({ data: input });
        }),

    // Delete tag
    delete: adminProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.prisma.tag.delete({ where: { id: input.id } });
        }),
});
