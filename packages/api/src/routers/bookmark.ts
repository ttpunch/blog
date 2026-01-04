import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const bookmarkRouter = router({
    toggle: protectedProcedure
        .input(z.object({
            articleId: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;
            const { articleId } = input;

            const existing = await (ctx.prisma as any).bookmark.findUnique({
                where: {
                    articleId_userId: {
                        articleId,
                        userId
                    }
                }
            });

            if (existing) {
                await (ctx.prisma as any).bookmark.delete({
                    where: { id: existing.id }
                });
                return { bookmarked: false };
            } else {
                await (ctx.prisma as any).bookmark.create({
                    data: {
                        articleId,
                        userId
                    }
                });
                return { bookmarked: true };
            }
        }),

    status: publicProcedure
        .input(z.object({
            articleId: z.string(),
        }))
        .query(async ({ ctx, input }) => {
            const userId = ctx.session?.user?.id;
            if (!userId) return { bookmarked: false };

            const bookmark = await (ctx.prisma as any).bookmark.findUnique({
                where: {
                    articleId_userId: {
                        articleId: input.articleId,
                        userId
                    }
                }
            });

            return { bookmarked: !!bookmark };
        }),

    list: protectedProcedure
        .query(async ({ ctx }) => {
            const userId = ctx.session.user.id;

            return await (ctx.prisma as any).bookmark.findMany({
                where: { userId },
                include: {
                    article: {
                        include: {
                            category: true,
                            tags: true,
                            _count: {
                                select: {
                                    likes: true,
                                    comments: true,
                                }
                            }
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });
        }),
});
