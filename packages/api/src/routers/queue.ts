import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { QueueStatus } from '@blog/db';

export const queueRouter = router({
    // List queue items
    list: protectedProcedure
        .input(
            z.object({
                status: z.nativeEnum(QueueStatus).optional(),
            })
        )
        .query(async ({ ctx, input }) => {
            return ctx.prisma.contentQueue.findMany({
                where: input.status ? { status: input.status } : {},
                orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
            });
        }),

    // Add topic to queue
    add: protectedProcedure
        .input(
            z.object({
                topic: z.string().min(1),
                keywords: z.array(z.string()).optional(),
                category: z.string().optional(),
                priority: z.number().default(0),
                scheduledAt: z.date().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return ctx.prisma.contentQueue.create({
                data: {
                    topic: input.topic,
                    keywords: input.keywords || [],
                    category: input.category,
                    priority: input.priority,
                    scheduledAt: input.scheduledAt,
                },
            });
        }),

    // Bulk add topics
    bulkAdd: protectedProcedure
        .input(
            z.object({
                topics: z.array(z.string()),
                category: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return ctx.prisma.contentQueue.createMany({
                data: input.topics.map((topic) => ({
                    topic,
                    keywords: [],
                    category: input.category,
                })),
            });
        }),

    // Update queue item status
    updateStatus: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                status: z.nativeEnum(QueueStatus),
                articleId: z.string().optional(),
                error: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { id, ...data } = input;
            return ctx.prisma.contentQueue.update({
                where: { id },
                data: {
                    ...data,
                    processedAt: input.status === QueueStatus.COMPLETED ? new Date() : undefined,
                },
            });
        }),

    // Delete queue item
    delete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.prisma.contentQueue.delete({
                where: { id: input.id },
            });
        }),

    // Clear completed/failed items
    clear: protectedProcedure
        .input(
            z.object({
                status: z.enum(['COMPLETED', 'FAILED']),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return ctx.prisma.contentQueue.deleteMany({
                where: { status: input.status as QueueStatus },
            });
        }),
});
