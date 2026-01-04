import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ModelFactory, ModelConfig } from "../providers/factory";
import { OutlineSchema } from "../schemas";

export class PlannerAgent {
    private model;

    constructor(config: ModelConfig) {
        this.model = ModelFactory.createStructuredModel(config, OutlineSchema);
    }

    async createOutline(topic: string) {
        const prompt = ChatPromptTemplate.fromMessages([
            ["system", "You are an experienced technical writer and editor. Create a comprehensive article outline for the given topic. logic flow, engagement, and clear structure are key."],
            ["user", "Topic: {topic}. Create a detailed outline."],
        ]);

        const chain = prompt.pipe(this.model);
        return await chain.invoke({ topic });
    }
}
