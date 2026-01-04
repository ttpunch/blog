import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ModelFactory, ModelConfig } from "../providers/factory";
import { ArticleDraftSchema, SeoReviewSchema } from "../schemas";
import { z } from "zod";

type ArticleDraft = z.infer<typeof ArticleDraftSchema>;

export class SeoAgent {
    private model;

    constructor(config: ModelConfig) {
        this.model = ModelFactory.createStructuredModel(config, SeoReviewSchema);
    }

    async optimize(article: ArticleDraft) {
        const prompt = ChatPromptTemplate.fromMessages([
            ["system", "You are an SEO expert. Analyze the article and provide optimization feedback. Suggest a better title and excerpt if needed."],
            ["user", "Article Title: {title}\nContent: {content}\n\nAnalyze and optimize."],
        ]);

        const chain = prompt.pipe(this.model);
        return await chain.invoke({
            title: article.title,
            content: article.content.substring(0, 15000) // Truncate if too long to save tokens
        });
    }
}
