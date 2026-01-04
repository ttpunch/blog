import * as dotenv from 'dotenv';
import path from 'path';
import { ContentPipeline } from '../graphs/content-pipeline';

// Load .env from root
dotenv.config({ path: path.join(__dirname, '../../../../.env') });

async function testHITL() {
    console.log('--- Starting HITL Test ---');

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

    console.log('\n--- Phase 1: Planning Only ---');
    const planResult = await pipeline.run("Future of AI Blogging", config, {
        stopAt: "plan"
    });

    console.log('Phase 1 Complete. Outline generated:', !!planResult.outline);
    if (!planResult.outline) {
        console.error("Failed to generate outline");
        return;
    }

    // Simulate User Edit
    console.log('\n--- Simulating User Edit ---');
    const editedOutline = { ...planResult.outline };
    editedOutline.title = "The Future of AI Blogging (EDITED BY USER)";
    console.log(`Title changed to: ${editedOutline.title}`);

    console.log('\n--- Phase 2: Resume from Writing ---');
    // We must pass the FULL state required for the next steps
    const resumeState = {
        ...planResult,
        outline: editedOutline,
        // Ensure other required fields are present if needed by downstream nodes
    };

    const finalResult = await pipeline.run("", config, {
        resumeFrom: "write",
        initialState: resumeState
    });

    console.log('--- Pipeline Finished ---');
    console.log('Final Article Title:', finalResult.draft?.title);

    if (finalResult.draft?.title?.includes("EDITED BY USER")) {
        console.log('✅ HITL Success! The user edit was preserved in the final draft.');
    } else {
        console.log('⚠️ HITL Warning: The user edit might not have been used (or AI changed it back).');
    }
}

testHITL().catch(console.error);
