import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ModelFactory, ModelConfig } from "../providers/factory";
import { ResearchOutputSchema, ResearchDataSchema } from "../schemas";

export class ResearchAgent {
    private model;
    private researchModel;

    constructor(config: ModelConfig) {
        this.model = ModelFactory.createStructuredModel(config, ResearchOutputSchema);
        this.researchModel = ModelFactory.createStructuredModel(config, ResearchDataSchema);
    }

    async findTopics(niche: string) {
        const prompt = ChatPromptTemplate.fromMessages([
            ["system", "You are an expert content strategist. Research and identify trending, high-value blog topics for a specific niche. Focus on topics that are evergreen or currently trending."],
            ["user", "Niche: {niche}. Generate 5 diverse topic ideas."],
        ]);

        const chain = prompt.pipe(this.model);
        return await chain.invoke({ niche });
    }

    async performResearch(topic: string) {
        try {
            const prompt = ChatPromptTemplate.fromMessages([
                ["system", "You are a deep-dive research assistant. Your goal is to gather facts, context, and a suggested structure for a blog post on a given topic. Be thorough and provide high-quality data that a writer can use."],
                ["user", "Topic: {topic}. Conduct deep research and provide structured context."],
            ]);

            const chain = prompt.pipe(this.researchModel);
            return await chain.invoke({ topic });
        } catch (error) {
            console.error("[ResearchAgent] Detailed error:", error);
            throw error;
        }
    }
}
