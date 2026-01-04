import * as dotenv from 'dotenv';
import path from 'path';
import { ModelFactory } from '../providers/factory';

// Load .env from root
dotenv.config({ path: path.join(__dirname, '../../../../.env') });

async function testConnectivity() {
    console.log('--- Environment Check ---');
    console.log('OPENROUTER_API_KEY defined:', !!process.env.OPENROUTER_API_KEY);
    console.log('OPENROUTER_API_KEY length:', process.env.OPENROUTER_API_KEY?.length);
    console.log('OLLAMA_API_KEY defined:', !!process.env.OLLAMA_API_KEY);
    console.log('OLLAMA_BASE_URL:', process.env.OLLAMA_BASE_URL);

    console.log('\n--- Testing OpenRouter ---');
    try {
        const openRouterConfig = {
            provider: 'openrouter' as const,
            modelName: process.env.OPENROUTER_MODEL || 'mistralai/devstral-2512:free',
            apiKey: process.env.OPENROUTER_API_KEY,
        };
        console.log(`Model: ${openRouterConfig.modelName}`);
        const openRouterModel = ModelFactory.create(openRouterConfig);
        const orRes = await openRouterModel.invoke('Say "OpenRouter Connection OK"');
        console.log('Result:', orRes.content);
        console.log('✅ OpenRouter Connected!');
    } catch (error) {
        console.error('❌ OpenRouter Failed:', (error as Error).message);
    }

    console.log('\n--- Testing Ollama Cloud ---');
    try {
        const ollamaConfig = {
            provider: 'ollama' as const,
            modelName: 'llama3',
            apiKey: process.env.OLLAMA_API_KEY,
            baseUrl: process.env.OLLAMA_BASE_URL,
        };
        console.log(`Host: ${ollamaConfig.baseUrl}`);
        const ollamaModel = ModelFactory.create(ollamaConfig);
        const ollamaRes = await ollamaModel.invoke('Say "Ollama Connection OK"');
        console.log('Result:', ollamaRes.content);
        console.log('✅ Ollama Cloud Connected!');
    } catch (error) {
        console.error('❌ Ollama Cloud Failed:', (error as Error).message);
    }
}

testConnectivity().catch(console.error);
