import * as dotenv from 'dotenv';
import path from 'path';
import { ContentPipeline } from '../graphs/content-pipeline';

// Load .env from root
dotenv.config({ path: path.join(__dirname, '../../../../.env') });

async function testCriticLoop() {
    console.log('--- Starting Critic Loop Test ---');

    const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
    const isOpenRouter = apiKey?.startsWith('sk-or-');

    const config = {
        provider: (isOpenRouter ? 'openrouter' : 'openai') as any,
        modelName: process.env.OPENROUTER_MODEL || 'gpt-3.5-turbo',
        apiKey: apiKey,
        onStep: async (step: string) => console.log(`[Step]: ${step}`)
    };

    if (!config.apiKey) {
        console.error("Skipping test: No API Key found");
        return;
    }

    const pipeline = new ContentPipeline(config);

    // Use a topic that might be controversial or hard to get right on first try to encourage critique
    // But since we can't force the LLM to give a low score easily, we mainly check if the graph runs without error.
    // To properly test the loop, one would typically use a mock critic.
    // However, seeing the "revisions" count in the final state will tell us if it looped.

    const result = await pipeline.run("The benefits of eating sand", config);

    console.log('--- Pipeline Finished ---');
    console.log('Final Revision Count:', result.revisionCount);
    console.log('Critic Score:', result.criticReview?.score);
    console.log('Critique:', result.criticReview?.critique);

    if (result.revisionCount && result.revisionCount > 0) {
        console.log('✅ Loop detected! Revisions occurred.');
    } else {
        console.log('ℹ️ No loop triggered (Score was likely >= 8). Test ran successfully linearly.');
    }
}

testCriticLoop().catch(console.error);
