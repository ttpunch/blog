
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: 'dstypd2hx',
    api_key: '339743977483734',
    api_secret: 'MzTtuFRBBDhGJNTOSNX2eHITO-4',
});

async function main() {
    console.log("Testing Cloudinary for cloud_name: dstypd2hx");
    try {
        const result = await cloudinary.api.ping();
        console.log("✅ Credentials Valid! Ping result:", result);
    } catch (error) {
        console.error("❌ Cloudinary connection failed:", error);
    }
}

main();
