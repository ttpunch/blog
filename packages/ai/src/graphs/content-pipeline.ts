import { StateGraph, END, Annotation } from "@langchain/langgraph";
import { ResearchAgent } from "../agents/research";
import { PlannerAgent } from "../agents/planner";
import { WriterAgent } from "../agents/writer";
import { CriticAgent } from "../agents/critic";
import { SeoAgent } from "../agents/seo";
import { ImageAgent } from "../agents/image";

import { ModelConfig } from "../providers/factory";

// Define the state using Annotation
const PipelineAnnotation = Annotation.Root({
    topic: Annotation<string>,
    researchData: Annotation<any>,
    outline: Annotation<any>,
    draft: Annotation<any>,
    criticReview: Annotation<any>,
    seoReview: Annotation<any>,
    imageUrl: Annotation<string>,

    // Loop control
    revisionCount: Annotation<number>({
        reducer: (x, y) => y ?? x ?? 0,
        default: () => 0,
    }),
    critiqueFeedback: Annotation<string[]>({
        reducer: (x, y) => y ?? x ?? [],
        default: () => [],
    }),

    finalArticle: Annotation<any>,
    error: Annotation<string>,
    config: Annotation<ModelConfig>,
});

type PipelineState = typeof PipelineAnnotation.State;

export class ContentPipeline {
    private graph;

    constructor(config: ModelConfig) {
        const builder = new StateGraph(PipelineAnnotation)
            .addNode("research", async (state: PipelineState) => {
                await config.onStep?.('RESEARCHING');
                try {
                    const agent = new ResearchAgent(state.config);
                    const researchData = await agent.performResearch(state.topic);
                    return { researchData } as any;
                } catch (e) {
                    return { error: `Research failed: ${(e as Error).message}` } as any;
                }
            })
            .addNode("plan", async (state: PipelineState) => {
                if (state.error) return {};
                await config.onStep?.('RESEARCHING'); // Still in research phase until outline is done
                try {
                    const agent = new PlannerAgent(state.config);
                    // Combine topic with research for better planning
                    const planningContext = `Topic: ${state.topic}\nResearch: ${JSON.stringify(state.researchData)}`;
                    const outline = await agent.createOutline(planningContext);
                    return { outline } as any;
                } catch (e) {
                    return { error: `Planning failed: ${(e as Error).message}` } as any;
                }
            })
            .addNode("write", async (state: PipelineState) => {
                if (state.error) return {};
                await config.onStep?.('WRITING');
                try {
                    const agent = new WriterAgent(state.config);

                    const isRevision = state.revisionCount > 0 && state.critiqueFeedback?.length > 0;

                    const draft = await agent.writeDraft(isRevision ? {
                        currentDraft: state.draft,
                        critiqueFeedback: state.critiqueFeedback
                    } : {
                        ...state.outline,
                        researchContext: state.researchData
                    });

                    return { draft } as any;
                } catch (e) {
                    return { error: `Writing failed: ${(e as Error).message}` } as any;
                }
            })
            .addNode("critic", async (state: PipelineState) => {
                if (state.error) return {};
                await config.onStep?.('WRITING'); // Critic is part of the write-review cycle
                try {
                    const agent = new CriticAgent(state.config);
                    const review = await agent.review(state.draft);

                    // Increment revision count
                    const newRevisionCount = (state.revisionCount || 0) + 1;

                    return {
                        criticReview: review,
                        revisionCount: newRevisionCount,
                        critiqueFeedback: review.critique
                    } as any;
                } catch (e) {
                    return { error: `Critique failed: ${(e as Error).message}` } as any;
                }
            })
            .addNode("seo", async (state: PipelineState) => {
                if (state.error) return {};
                await config.onStep?.('OPTIMIZING');
                try {
                    const agent = new SeoAgent(state.config);
                    const review = await agent.optimize(state.draft);
                    return { seoReview: review } as any;
                } catch (e) {
                    return { error: `SEO failed: ${(e as Error).message}` } as any;
                }
            })
            .addNode("image", async (state: PipelineState) => {
                if (state.error) return {};
                // No specific enum for image gen, using OPTIMIZING or staying there
                try {
                    // Title for the image prompt
                    const title = state.seoReview?.improvedTitle || state.draft?.title || state.topic;
                    // Use imageApiKey (OpenAI key) for DALL-E, or fallback to general apiKey
                    const agent = new ImageAgent(state.config.imageApiKey || state.config.apiKey);
                    const imageUrl = await agent.generateCoverImage(title);
                    return { imageUrl } as any;
                } catch (e) {
                    console.error("Image generation skipped:", e);
                    return { imageUrl: "" } as any;
                }
            })

            .addEdge("research", "plan")
            .addEdge("plan", "write")
            .addEdge("write", "critic")
            .addConditionalEdges(
                "critic",
                (state: PipelineState) => {
                    if (state.error) return "seo";

                    const score = state.criticReview?.score || 0;
                    const revisions = state.revisionCount || 0;

                    if (score < 8 && revisions <= 2) {
                        console.log(`[ContentPipeline] Score ${score} is too low. Revision ${revisions}/2. Looping back to writer.`);
                        return "write";
                    }
                    return "seo";
                },
                {
                    write: "write",
                    seo: "seo"
                }
            )
            .addEdge("seo", "image")
            .addEdge("image", END);

        builder.setEntryPoint("research");

        this.graph = builder.compile();
    }

    async run(topic: string, config: ModelConfig, options?: { stopAt?: string, resumeFrom?: string, initialState?: any }) {
        // If resuming, use the provided initial state
        const inputState = options?.resumeFrom ? {
            ...options.initialState,
            config,
            error: "",
        } : {
            topic,
            config,
            error: "",
            imageUrl: ""
        };

        const list = await this.graph.stream(inputState as any);
        let finalState = inputState;

        for await (const chunk of list) {
            const nodeName = Object.keys(chunk)[0];
            const nodeState = chunk[nodeName];
            finalState = { ...finalState, ...nodeState };

            if (config.onStep) await config.onStep(nodeName.toUpperCase());

            if (options?.stopAt && nodeName === options.stopAt) {
                console.log(`[ContentPipeline] Stopping at ${nodeName} as requested.`);
                break;
            }
        }

        return finalState;
    }
}
