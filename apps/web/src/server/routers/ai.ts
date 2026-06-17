import { z } from 'zod';
import { router, adminProcedure, protectedProcedure } from '../trpc';
import { ContentPipeline } from '@/lib/ai/index';

export const aiRouter = router({
    generateArticle: adminProcedure
        .input(z.object({
            topic: z.string(),
            provider: z.enum(['openai', 'ollama', 'openrouter']).optional().default('openai'),
            modelName: z.string().optional(),
            tone: z.string().optional(),
            length: z.enum(['short', 'medium', 'long']).optional(),
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
                throw new Error(`API key for ${input.provider} not found in environment.`);
            }

            const article = await ctx.prisma.article.create({
                data: {
                    title: `Generating: ${input.topic}`,
                    slug: `generating-${Date.now()}`,
                    content: "",
                    status: 'QUEUED',
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
                imageApiKey: openaiKey,
                tone: input.tone,
                length: input.length,
            };

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
            tone: z.string().optional(),
            length: z.enum(['short', 'medium', 'long']).optional(),
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
                imageApiKey: openaiKey,
                tone: input.tone,
                length: input.length,
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

                    await ctx.prisma.article.update({
                        where: { id: article.id },
                        data: {
                            status: 'AWAITING_APPROVAL',
                            outline: result.outline,
                            pipelineState: JSON.stringify({
                                research: result.researchData,
                                tone: input.tone,
                                length: input.length,
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
            editedOutline: z.any().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            const article = await ctx.prisma.article.findUnique({
                where: { id: input.articleId }
            });

            if (!article) throw new Error("Article not found");

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

            const savedState = article.pipelineState ? JSON.parse(article.pipelineState) : {};

            const runConfig = {
                provider: provider as any,
                modelName: article.aiModel || undefined,
                apiKey: providerKey,
                baseUrl,
                imageApiKey: openaiKey,
                // Carry the originally selected tone/length into the writing stage
                tone: savedState.tone,
                length: savedState.length,
            };

            const researchData = savedState.research;
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
