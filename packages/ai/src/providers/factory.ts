import { ChatOpenAI } from "@langchain/openai";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Runnable } from "@langchain/core/runnables";
import { z } from "zod";

export interface ModelConfig {
    provider: "openai" | "ollama" | "openrouter";
    modelName?: string;
    apiKey?: string;
    baseUrl?: string;
    temperature?: number;
    imageApiKey?: string;
    onStep?: (status: string) => Promise<void>;
}

export class ModelFactory {
    static create(config: ModelConfig): BaseChatModel {
        const temperature = config.temperature ?? 0.7;

        switch (config.provider) {
            case "openai":
                return new ChatOpenAI({
                    modelName: config.modelName || "gpt-4-turbo",
                    openAIApiKey: config.apiKey || process.env.OPENAI_API_KEY,
                    temperature,
                }) as any;

            case "openrouter":
                return new ChatOpenAI({
                    modelName: config.modelName || process.env.OPENROUTER_MODEL || "openai/gpt-4-turbo",
                    openAIApiKey: config.apiKey || process.env.OPENROUTER_API_KEY,
                    configuration: {
                        baseURL: "https://openrouter.ai/api/v1",
                    },
                    temperature,
                }) as any;

            case "ollama":
                const headers: Record<string, string> = {};
                if (config.apiKey) {
                    headers["Authorization"] = `Bearer ${config.apiKey}`;
                }

                return new ChatOllama({
                    model: config.modelName || process.env.OLLAMA_MODEL || "llama3",
                    baseUrl: config.baseUrl || process.env.OLLAMA_BASE_URL || "http://localhost:11434",
                    headers,
                    temperature,
                }) as any;

            default:
                throw new Error(`Unsupported provider: ${config.provider}`);
        }
    }

    /**
     * Creates a model that returns structured output.
     * Handles provider-specific limitations (like lack of tool calling in some models).
     */
    static createStructuredModel<T extends z.ZodTypeAny>(config: ModelConfig, schema: T): Runnable<any, z.infer<T>> {
        const model = this.create(config);

        if (config.provider === "openai") {
            return model.withStructuredOutput(schema);
        }

        if (config.provider === "openrouter") {
            // Some OpenRouter models don't support tools, use JSON mode as a safer default
            // while still leveraging withStructuredOutput if possible.
            try {
                return (model as ChatOpenAI).withStructuredOutput(schema, {
                    method: "json_mode"
                });
            } catch (e) {
                console.warn("OpenRouter withStructuredOutput failed, falling back to manual parsing", e);
            }
        }

        // Fallback for Ollama or failing OpenRouter: Use JsonOutputParser
        const parser = new JsonOutputParser<z.infer<T>>();

        // Wrap the model with a parser
        // We need to inject the schema instructions into the prompt later or use a generic one here
        return model.pipe(parser);
    }
}
