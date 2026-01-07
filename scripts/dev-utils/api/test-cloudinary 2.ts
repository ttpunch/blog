
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function main() {
    console.log(`Testing Cloudinary for cloud_name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
    if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME === 'blog') {
        console.warn("WARNING: 'blog' looks like a placeholder cloud name.");
    }

    try {
        // Try to get account details (test credentials)
        const result = await cloudinary.api.ping();
        console.log("✅ Credentials Valid! Ping result:", result);
    } catch (error) {
        console.error("❌ Cloudinary connection failed:", error);
    }
}

main();
