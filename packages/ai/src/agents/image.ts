import { DallEAPIWrapper } from "@langchain/openai";

export class ImageAgent {
    private model;

    constructor(apiKey?: string) {
        this.model = new DallEAPIWrapper({
            n: 1,
            modelName: "dall-e-3",
            apiKey: apiKey || process.env.OPENAI_API_KEY,
        });
    }

    async generateCoverImage(prompt: string): Promise<string> {
        try {
            // DALL-E 3 prompts need to be descriptive
            const enhancedPrompt = `A professional, modern blog cover image for an article about: ${prompt}. High quality, 4k, digital art style.`;

            const result = await this.model.invoke(enhancedPrompt);
            return result;
        } catch (error) {
            console.error("Image generation failed:", error);
            return ""; // Return empty on failure to not block pipeline
        }
    }
}
