import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';

export const likeRouter = router({
    // Toggle like — login required
    toggle: protectedProcedure
        .input(z.object({
            articleId: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

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
        }),

    // Counts are public; isLiked only resolves when logged in
    status: publicProcedure
        .input(z.object({ articleId: z.string() }))
        .query(async ({ ctx, input }) => {
            const userId = (ctx.session?.user as any)?.id;

            const count = await ctx.prisma.like.count({
                where: { articleId: input.articleId },
            });

            let isLiked = false;
            if (userId) {
                const existing = await ctx.prisma.like.findFirst({
                    where: { articleId: input.articleId, userId },
                });
                isLiked = !!existing;
            }

            return { count, isLiked };
        }),
});
