import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';

export const likeRouter = router({
    toggle: publicProcedure
        .input(z.object({
            articleId: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            const userId = (ctx.session?.user as any)?.id;
            const ipAddress = ctx.req?.headers['x-forwarded-for'] || ctx.req?.socket?.remoteAddress;

            if (userId) {
                // Authenticated user like
                const existing = await ctx.prisma.like.findFirst({
                    where: { articleId: input.articleId, userId },
                });

                if (existing) {
                    await ctx.prisma.like.delete({ where: { id: existing.id } });
                    return { liked: false };
                } else {
                    await ctx.prisma.like.create({
                        data: { articleId: input.articleId, userId },
                    });
                    return { liked: true };
                }
            } else {
                // Guest like (IP based)
                const existing = await ctx.prisma.like.findFirst({
                    where: { articleId: input.articleId, ipAddress: String(ipAddress), userId: null },
                });

                if (existing) {
                    await ctx.prisma.like.delete({ where: { id: existing.id } });
                    return { liked: false };
                } else {
                    await ctx.prisma.like.create({
                        data: { articleId: input.articleId, ipAddress: String(ipAddress) },
                    });
                    return { liked: true };
                }
            }
        }),

    status: publicProcedure
        .input(z.object({ articleId: z.string() }))
        .query(async ({ ctx, input }) => {
            const userId = (ctx.session?.user as any)?.id;
            const ipAddress = ctx.req?.headers['x-forwarded-for'] || ctx.req?.socket?.remoteAddress;

            const count = await ctx.prisma.like.count({
                where: { articleId: input.articleId },
            });

            let isLiked = false;
            if (userId) {
                const existing = await ctx.prisma.like.findFirst({
                    where: { articleId: input.articleId, userId },
                });
                isLiked = !!existing;
            } else {
                const existing = await ctx.prisma.like.findFirst({
                    where: { articleId: input.articleId, ipAddress: String(ipAddress), userId: null },
                });
                isLiked = !!existing;
            }

            return { count, isLiked };
        }),
});
