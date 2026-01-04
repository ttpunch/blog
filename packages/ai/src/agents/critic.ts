import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ModelFactory, ModelConfig } from "../providers/factory";
import { ArticleDraftSchema, CriticOutputSchema } from "../schemas";
import { z } from "zod";

type ArticleDraft = z.infer<typeof ArticleDraftSchema>;

export class CriticAgent {
    private model;

    constructor(config: ModelConfig) {
        this.model = ModelFactory.createStructuredModel(config, CriticOutputSchema);
    }

    async review(article: ArticleDraft) {
        const prompt = ChatPromptTemplate.fromMessages([
            ["system", "You are an expert editor and critic. Analyze the article draft for quality, coherence, style, and factual plausibility. Provide a critical review with a score (1-10) and specific improvement points."],
            ["user", "Article Title: {title}\nContent: {content}\n\nReview this draft."],
        ]);

        const chain = prompt.pipe(this.model);
        return await chain.invoke({
            title: article.title,
            content: article.content.substring(0, 20000) // Allow slightly more context
        });
    }
}
