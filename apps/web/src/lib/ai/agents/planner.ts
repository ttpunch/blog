import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ModelFactory, ModelConfig, lengthGuidance } from "../providers/factory";
import { OutlineSchema } from "../schemas";

export class PlannerAgent {
    private model;
    private config: ModelConfig;

    constructor(config: ModelConfig) {
        this.config = config;
        this.model = ModelFactory.createStructuredModel(config, OutlineSchema);
    }

    async createOutline(topic: string) {
        const tone = this.config.tone || "professional";
        const guidance = lengthGuidance(this.config.length);

        const prompt = ChatPromptTemplate.fromMessages([
            ["system", `You are an experienced technical writer and editor. Create a comprehensive article outline for the given topic. Logic flow, engagement, and clear structure are key. Write in a ${tone} tone. Plan the section word counts so the finished article is ${guidance}.`],
            ["user", "Topic: {topic}. Create a detailed outline."],
        ]);

        const chain = prompt.pipe(this.model);
        return await chain.invoke({ topic });
    }
}
