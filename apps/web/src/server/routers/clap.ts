import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const clapRouter = router({
    // Submit claps — login required
    submit: protectedProcedure
        .input(z.object({
            articleId: z.string(),
            amount: z.number().min(1).max(50),
        }))
        .mutation(async ({ ctx, input }) => {
            const { articleId, amount } = input;
            const userId = ctx.session.user.id;

            const existing = await ctx.prisma.clap.findUnique({
                where: {
                    articleId_userId: { articleId, userId }
                }
            });

            if (existing) {
                // Increment, capping at 50 per user
                const newScore = Math.min(existing.score + amount, 50);
                const addedScore = newScore - existing.score;

                const clap = await ctx.prisma.clap.update({
                    where: { id: existing.id },
                    data: { score: newScore }
                });

                if (addedScore > 0) {
                    await (ctx.prisma.article as any).update({
                        where: { id: articleId },
                        data: { clapsCount: { increment: addedScore } }
                    });
                }
                return clap;
            } else {
                const clap = await ctx.prisma.clap.create({
                    data: {
                        articleId,
                        userId,
                        score: Math.min(amount, 50)
                    }
                });

                await (ctx.prisma.article as any).update({
                    where: { id: articleId },
                    data: { clapsCount: { increment: clap.score } }
                });
                return clap;
            }
        }),

    // Total claps are public; userClaps only resolves when logged in
    byArticle: publicProcedure
        .input(z.object({ articleId: z.string() }))
        .query(async ({ ctx, input }) => {
            const { articleId } = input;
            const userId = (ctx.session?.user as any)?.id;

            const article = await (ctx.prisma.article as any).findUnique({
                where: { id: articleId },
                select: { clapsCount: true }
            });

            let userScore = 0;
            if (userId) {
                const userClap = await ctx.prisma.clap.findUnique({
                    where: { articleId_userId: { articleId, userId } }
                });
                userScore = userClap?.score || 0;
            }

            return {
                totalClaps: article?.clapsCount || 0,
                userClaps: userScore
            };
        }),
});
