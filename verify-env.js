const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Try to load from root .env
const rootEnvPath = path.resolve(__dirname, '../../.env');
console.log('Checking root .env at:', rootEnvPath);

if (fs.existsSync(rootEnvPath)) {
    console.log('✅ Found root .env file');
    const envConfig = dotenv.parse(fs.readFileSync(rootEnvPath));
    console.log('--- Root .env content check ---');
    console.log('GOOGLE_CLIENT_ID exists:', !!envConfig.GOOGLE_CLIENT_ID);
    console.log('GOOGLE_CLIENT_ID value:', envConfig.GOOGLE_CLIENT_ID ? envConfig.GOOGLE_CLIENT_ID.substring(0, 10) + '...' : 'MISSING');
} else {
    console.log('❌ Root .env file NOT found');
}

console.log('\n--- Process Environment check ---');
console.log('process.env.GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID.substring(0, 10) + '...' : 'UNDEFINED');
