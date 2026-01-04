import { z } from "zod";

export const ResearchOutputSchema = z.object({
    topics: z.array(z.object({
        topic: z.string(),
        description: z.string(),
        keywords: z.array(z.string()),
        searchVolume: z.string().optional(),
        relevance: z.number().describe("Score 1-10"),
    })),
});

export const ResearchDataSchema = z.object({
    topic: z.string(),
    keyFacts: z.array(z.string()),
    context: z.string().describe("Background information and current trends related to the topic"),
    suggestedStructure: z.array(z.string()).describe("List of section titles or themes to cover"),
    sources: z.array(z.string()).optional(),
});

export const OutlineSchema = z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    targetAudience: z.string(),
    sections: z.array(z.object({
        title: z.string(),
        keyPoints: z.array(z.string()),
        estimatedWordCount: z.number(),
    })),
    totalEstimatedWordCount: z.number(),
});

export const ArticleDraftSchema = z.object({
    title: z.string(),
    content: z.string().describe("Markdown content"),
    excerpt: z.string(),
    metaDescription: z.string(),
    readingTime: z.number(),
});

export const SeoReviewSchema = z.object({
    score: z.number().describe("0-100"),
    feedback: z.array(z.string()),
    improvedTitle: z.string().optional(),
    improvedExcerpt: z.string().optional(),
    keywordsUsed: z.array(z.string()),
});

export const CriticOutputSchema = z.object({
    score: z.number().describe("Quality score 1-10"),
    critique: z.array(z.string()).describe("List of potential issues or areas for improvement"),
    overallAnalysis: z.string().describe("General feedback on tone, style, and accuracy"),
});
