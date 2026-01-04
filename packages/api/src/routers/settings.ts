import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';

export const settingsRouter = router({
    // Get settings
    get: protectedProcedure.query(async ({ ctx }) => {
        let settings = await ctx.prisma.settings.findUnique({
            where: { id: 'default' },
        });

        // Create default settings if not exists
        if (!settings) {
            settings = await ctx.prisma.settings.create({
                data: { id: 'default' },
            });
        }

        return settings;
    }),

    // Update settings
    update: protectedProcedure
        .input(
            z.object({
                defaultProvider: z.enum(['ollama', 'openrouter', 'openai']).optional(),
                ollamaEndpoint: z.string().optional(),
                ollamaModel: z.string().optional(),
                openrouterModel: z.string().optional(),
                openaiModel: z.string().optional(),
                autoPublish: z.boolean().optional(),
                dailyLimit: z.number().min(1).max(50).optional(),
                siteName: z.string().optional(),
                siteDescription: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return ctx.prisma.settings.upsert({
                where: { id: 'default' },
                create: { id: 'default', ...input },
                update: input,
            });
        }),
});
