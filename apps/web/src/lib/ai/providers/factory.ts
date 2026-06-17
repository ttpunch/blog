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
    tone?: string;
    length?: "short" | "medium" | "long";
    onStep?: (status: string) => Promise<void>;
}

// Shared helper so planner and writer describe length consistently
export function lengthGuidance(length?: string): string {
    switch (length) {
        case "short":
            return "approximately 300-500 words total";
        case "long":
            return "a comprehensive deep dive of 2000+ words total";
        case "medium":
        default:
            return "approximately 800-1200 words total";
    }
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

    static createStructuredModel<T extends z.ZodTypeAny>(config: ModelConfig, schema: T): Runnable<any, z.infer<T>> {
        const model = this.create(config);

        if (config.provider === "openai") {
            return model.withStructuredOutput(schema);
        }

        if (config.provider === "openrouter") {
            try {
                return (model as ChatOpenAI).withStructuredOutput(schema, {
                    method: "json_mode"
                });
            } catch (e) {
                console.warn("OpenRouter withStructuredOutput failed, falling back to manual parsing", e);
            }
        }

        const parser = new JsonOutputParser<z.infer<T>>();
        return model.pipe(parser);
    }
}
