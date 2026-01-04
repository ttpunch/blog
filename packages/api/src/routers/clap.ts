import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const clapRouter = router({
    submit: publicProcedure
        .input(z.object({
            articleId: z.string(),
            amount: z.number().min(1).max(50),
        }))
        .mutation(async ({ ctx, input }) => {
            const { articleId, amount } = input;
            const userId = (ctx.session?.user as any)?.id;

            // Basic IP tracking for guests
            // Note: In Next.js App Router with TRPC, getting IP can be tricky. 
            // We rely on headers passed in context if available, or just fallback.
            // For this implementation, we prioritize UserId. If not found, we try IP.

            let ipAddress = 'unknown';
            try {
                if (!userId && ctx.req?.headers) {
                    const forwarded = ctx.req.headers.get("x-forwarded-for");
                    ipAddress = forwarded ? forwarded.split(',')[0] : "127.0.0.1";
                } else if (!userId) {
                    ipAddress = "127.0.0.1"; // Fallback if no req/headers (e.g. some test envs)
                }
            } catch (e) {
                console.error("Failed to parse IP", e);
                ipAddress = "127.0.0.1";
            }

            console.log("Clap Request:", { userId, ipAddress, articleId, amount });

            // If neither (unlikely if guest logic holds), we can't track.
            if (!userId && ipAddress === 'unknown') {
                throw new TRPCError({ code: "BAD_REQUEST", message: "Cannot identify user" });
            }

            // Upsert logic
            if (userId) {
                // Authenticated User
                const existing = await ctx.prisma.clap.findUnique({
                    where: {
                        articleId_userId: {
                            articleId,
                            userId
                        }
                    }
                });

                if (existing) {
                    // Increment, capping at 50
                    const newScore = Math.min(existing.score + amount, 50);
                    return ctx.prisma.clap.update({
                        where: { id: existing.id },
                        data: { score: newScore }
                    });
                } else {
                    return ctx.prisma.clap.create({
                        data: {
                            articleId,
                            userId,
                            score: Math.min(amount, 50)
                        }
                    });
                }
            } else {
                // Guest User
                // Note: Prisma schema defined @@unique([articleId, ipAddress]) might fail if we didn't add it perfectly or if IP is null.
                // Let's rely on findFirst for guests to be safer against schema constraints if I decided to relax them.

                // Actually, I defined @@unique([articleId, ipAddress]). Let's assume it works for non-null IPs.

                const existing = await ctx.prisma.clap.findFirst({
                    where: {
                        articleId,
                        ipAddress
                    }
                });

                if (existing) {
                    const newScore = Math.min(existing.score + amount, 50);
                    return ctx.prisma.clap.update({
                        where: { id: existing.id },
                        data: { score: newScore }
                    });
                } else {
                    return ctx.prisma.clap.create({
                        data: {
                            articleId,
                            ipAddress,
                            score: Math.min(amount, 50)
                        }
                    });
                }
            }
        }),

    byArticle: publicProcedure
        .input(z.object({ articleId: z.string() }))
        .query(async ({ ctx, input }) => {
            const { articleId } = input;
            const userId = (ctx.session?.user as any)?.id;

            let ipAddress = '127.0.0.1'; // simplified fallback
            if (!userId && ctx.req?.headers) {
                const forwarded = ctx.req.headers.get("x-forwarded-for");
                if (forwarded) ipAddress = forwarded.split(',')[0];
            }

            const totalAgg = await ctx.prisma.clap.aggregate({
                where: { articleId },
                _sum: { score: true }
            });

            let userScore = 0;
            if (userId) {
                const userClap = await ctx.prisma.clap.findUnique({
                    where: { articleId_userId: { articleId, userId } }
                });
                userScore = userClap?.score || 0;
            } else {
                // Check guest clap
                const guestClap = await ctx.prisma.clap.findFirst({
                    where: { articleId, ipAddress }
                });
                userScore = guestClap?.score || 0;
            }

            return {
                totalClaps: totalAgg._sum.score || 0,
                userClaps: userScore
            };
        }),
});
