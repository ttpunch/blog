import { z } from 'zod';
import { router, adminProcedure, protectedProcedure } from '../trpc';
import { ContentPipeline } from '@blog/ai';

export const aiRouter = router({
    generateArticle: adminProcedure
        .input(z.object({
            topic: z.string(),
            provider: z.enum(['openai', 'ollama', 'openrouter']).optional().default('openai'),
            modelName: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            // 1. Resolve API Keys
            const openaiKey = process.env.OPENAI_API_KEY;
            let providerKey = openaiKey;
            let baseUrl = undefined;

            if (input.provider === 'openrouter') {
                providerKey = process.env.OPENROUTER_API_KEY;
            } else if (input.provider === 'ollama') {
                providerKey = process.env.OLLAMA_API_KEY;
                baseUrl = process.env.OLLAMA_BASE_URL;
            }

            if (!providerKey && input.provider !== 'ollama') {
                throw new Error(`API key for ${input.provider} not found in environment.`);
            }

            // 2. Create Article Record upfront with QUEUED status
            const article = await ctx.prisma.article.create({
                data: {
                    title: `Generating: ${input.topic}`,
                    slug: `generating-${Date.now()}`, // Temporary slug
                    content: "",
                    status: 'QUEUED',
                    aiGenerated: true,
                    aiProvider: input.provider,
                    aiModel: input.modelName,
                    aiPrompt: input.topic,
                }
            });

            // 3. Initialize Pipeline with a callback to update DB status
            const pipeline = new ContentPipeline({
                provider: input.provider as any,
                modelName: input.modelName,
                apiKey: providerKey,
                baseUrl,
                // Pass OpenAI key specifically for DALL-E if current provider isn't OpenAI
                onStep: async (status: any) => {
                    await ctx.prisma.article.update({
                        where: { id: article.id },
                        data: { status }
                    });
                }
            });

            // 4. Run Pipeline asynchronously (don't await for the whole thing to return to user immediately)
            // But tRPC mutations usually expect a return. We'll run it and return the ID.
            // To prevent the request from timing out or blocking, we fire and forget or use a background task.
            // For now, we'll wait for it but the UI will poll for status.

            // Re-injecting the OpenAI key for the ImageAgent via the config if needed
            const runConfig = {
                provider: input.provider as any,
                modelName: input.modelName,
                apiKey: providerKey,
                baseUrl,
                // We need a way to pass the OpenAI key for images if provider is different
                imageApiKey: openaiKey
            };

            // Start the pipeline execution
            // We use a promise wrapper to handle the background execution properly
            (async () => {
                try {
                    const result = await pipeline.run(input.topic, runConfig as any);

                    if (result.error) {
                        await ctx.prisma.article.update({
                            where: { id: article.id },
                            data: {
                                status: 'REJECTED',
                                pipelineState: JSON.stringify({ error: result.error })
                            }
                        });
                        return;
                    }

                    const content = result.draft?.content || "";
                    const title = result.seoReview?.improvedTitle || result.draft?.title || input.topic;
                    const excerpt = result.seoReview?.improvedExcerpt || result.draft?.excerpt || "";

                    await ctx.prisma.article.update({
                        where: { id: article.id },
                        data: {
                            title,
                            slug: `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
                            content,
                            excerpt,
                            metaDescription: result.seoReview?.metaDescription || "",
                            readingTime: result.draft?.readingTime || Math.ceil(content.split(/\s+/).length / 200),
                            coverImage: result.imageUrl || null,
                            status: 'REVIEW',
                            pipelineState: JSON.stringify({
                                research: result.researchData,
                                seo: result.seoReview
                            })
                        }
                    });
                } catch (error) {
                    console.error("[AI Router] Background pipeline failed:", error);
                    await ctx.prisma.article.update({
                        where: { id: article.id },
                        data: { status: 'REJECTED' }
                    });
                }
            })();

            return { id: article.id };
        }),

    generateOutline: adminProcedure
        .input(z.object({
            topic: z.string(),
            provider: z.enum(['openai', 'ollama', 'openrouter']).optional().default('openai'),
            modelName: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            const openaiKey = process.env.OPENAI_API_KEY;
            let providerKey = openaiKey;
            let baseUrl = undefined;

            if (input.provider === 'openrouter') {
                providerKey = process.env.OPENROUTER_API_KEY;
            } else if (input.provider === 'ollama') {
                providerKey = process.env.OLLAMA_API_KEY;
                baseUrl = process.env.OLLAMA_BASE_URL;
            }

            if (!providerKey && input.provider !== 'ollama') {
                throw new Error(`API key for ${input.provider} not found.`);
            }

            const article = await ctx.prisma.article.create({
                data: {
                    title: `Planning: ${input.topic}`,
                    slug: `planning-${Date.now()}`,
                    content: "",
                    status: 'PLANNING',
                    aiGenerated: true,
                    aiProvider: input.provider,
                    aiModel: input.modelName,
                    aiPrompt: input.topic,
                }
            });

            const pipeline = new ContentPipeline({
                provider: input.provider as any,
                modelName: input.modelName,
                apiKey: providerKey,
                baseUrl,
                onStep: async (status: any) => {
                    await ctx.prisma.article.update({
                        where: { id: article.id },
                        data: { status }
                    });
                }
            });

            const runConfig = {
                provider: input.provider as any,
                modelName: input.modelName,
                apiKey: providerKey,
                baseUrl,
                imageApiKey: openaiKey
            };

            (async () => {
                try {
                    const result = await pipeline.run(input.topic, runConfig as any, { stopAt: 'plan' });

                    if (result.error) {
                        await ctx.prisma.article.update({
                            where: { id: article.id },
                            data: {
                                status: 'REJECTED',
                                pipelineState: JSON.stringify({ error: result.error })
                            }
                        });
                        return;
                    }

                    // Save outline and update status to AWAITING_APPROVAL
                    await ctx.prisma.article.update({
                        where: { id: article.id },
                        data: {
                            status: 'AWAITING_APPROVAL',
                            outline: result.outline,
                            pipelineState: JSON.stringify({
                                research: result.researchData,
                                // We need to save the full state to resume later if needed, 
                                // but specifically researchData is critical for the writer.
                                // The new pipelineState field usage suggests we might need a broader storage 
                                // if we want to be perfectly stateless on the server.
                                // For now, storing researchData is enough because we re-inject it.
                            })
                        }
                    });
                } catch (error) {
                    console.error("[AI Router] Outline generation failed:", error);
                    await ctx.prisma.article.update({
                        where: { id: article.id },
                        data: {
                            status: 'REJECTED',
                            pipelineState: JSON.stringify({
                                error: (error as any).message || String(error),
                                stack: (error as any).stack
                            })
                        }
                    });
                }
            })();

            return { id: article.id };
        }),

    approveOutline: adminProcedure
        .input(z.object({
            articleId: z.string(),
            editedOutline: z.any().optional(), // Allow any JSON for the outline
        }))
        .mutation(async ({ ctx, input }) => {
            const article = await ctx.prisma.article.findUnique({
                where: { id: input.articleId }
            });

            if (!article) throw new Error("Article not found");

            // Re-resolve keys (duplicated logic, could be refactored into helper)
            const openaiKey = process.env.OPENAI_API_KEY;
            let providerKey = openaiKey;
            let baseUrl = undefined;
            const provider = article.aiProvider || 'openai';

            if (provider === 'openrouter') providerKey = process.env.OPENROUTER_API_KEY;
            else if (provider === 'ollama') {
                providerKey = process.env.OLLAMA_API_KEY;
                baseUrl = process.env.OLLAMA_BASE_URL;
            }

            const pipeline = new ContentPipeline({
                provider: provider as any,
                modelName: article.aiModel || undefined,
                apiKey: providerKey,
                baseUrl,
                onStep: async (status: any) => {
                    await ctx.prisma.article.update({
                        where: { id: article.id },
                        data: { status }
                    });
                }
            });

            const runConfig = {
                provider: provider as any,
                modelName: article.aiModel || undefined,
                apiKey: providerKey,
                baseUrl,
                imageApiKey: openaiKey
            };

            // Reconstruct state
            // We need researchData. We stored it in pipelineState.
            const savedState = article.pipelineState ? JSON.parse(article.pipelineState) : {};
            const researchData = savedState.research;
            // Use edited outline or the one from DB (though we expect frontend to pass it back)
            const outline = input.editedOutline || (article as any).outline;

            const initialState = {
                topic: article.aiPrompt || "",
                researchData,
                outline,
                config: runConfig,
                error: "",
                imageUrl: ""
            };

            (async () => {
                try {
                    const result = await pipeline.run(article.aiPrompt || "", runConfig as any, {
                        resumeFrom: 'write',
                        initialState: initialState
                    });

                    if (result.error) {
                        await ctx.prisma.article.update({ where: { id: article.id }, data: { status: 'REJECTED' } });
                        return;
                    }

                    // Success - Update to Review
                    const content = result.draft?.content || "";
                    const title = result.seoReview?.improvedTitle || result.draft?.title || article.title;
                    const excerpt = result.seoReview?.improvedExcerpt || result.draft?.excerpt || "";

                    await ctx.prisma.article.update({
                        where: { id: article.id },
                        data: {
                            title,
                            slug: `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
                            content,
                            excerpt,
                            metaDescription: result.seoReview?.metaDescription || "",
                            readingTime: result.draft?.readingTime || Math.ceil(content.split(/\s+/).length / 200),
                            coverImage: result.imageUrl || null,
                            status: 'REVIEW',
                            pipelineState: JSON.stringify({
                                research: result.researchData,
                                seo: result.seoReview,
                                critic: result.criticReview
                            })
                        }
                    });

                } catch (error) {
                    console.error("[AI Router] Approval execution failed:", error);
                    await ctx.prisma.article.update({
                        where: { id: article.id },
                        data: {
                            status: 'REJECTED',
                            pipelineState: JSON.stringify({
                                error: (error as any).message || String(error),
                                stack: (error as any).stack
                            })
                        }
                    });
                }
            })();

            return { success: true };
        }),

    getArticleStatus: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const article = await ctx.prisma.article.findUnique({
                where: { id: input.id },
                select: { id: true, status: true, title: true }
            });
            return article;
        }),
});
