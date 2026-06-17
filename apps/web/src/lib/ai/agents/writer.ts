import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ModelFactory, ModelConfig, lengthGuidance } from "../providers/factory";
import { ArticleDraftSchema, OutlineSchema } from "../schemas";
import { z } from "zod";

type Outline = z.infer<typeof OutlineSchema>;

export class WriterAgent {
    private model;
    private config: ModelConfig;

    constructor(config: ModelConfig) {
        this.config = config;
        this.model = ModelFactory.createStructuredModel(config, ArticleDraftSchema);
    }

    async writeDraft(input: any) {
        const isRevision = input.critiqueFeedback && input.critiqueFeedback.length > 0;
        const tone = this.config.tone || "professional";
        const guidance = lengthGuidance(this.config.length);

        const systemPrompt = isRevision
            ? `You are an expert technical editor. Rewrite the following blog post to address the specific critique provided. Improve the quality, flow, and accuracy while maintaining the core message. Keep a ${tone} tone and aim for ${guidance}. Return the full revised article.`
            : `You are a professional blog writer. Write a high-quality, engaging article based on the provided outline. Use Markdown formatting. Use H2 and H3 for headers. Keep paragraphs concise. Write in a ${tone} tone and aim for ${guidance}.`;

        const userContent = isRevision
            ? `Original Draft: ${JSON.stringify(input.currentDraft)}\n\nCritique Feedback: ${JSON.stringify(input.critiqueFeedback)}\n\nRewrite the article.`
            : `Outline: ${JSON.stringify(input, null, 2)}\n\nWrite the full article.`;

        const prompt = ChatPromptTemplate.fromMessages([
            ["system", systemPrompt],
            ["user", "{input_content}"],
        ]);

        const chain = prompt.pipe(this.model);
        return await chain.invoke({
            input_content: userContent
        });
    }
}
