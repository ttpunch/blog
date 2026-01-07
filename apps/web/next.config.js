/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@blog/api', '@blog/db', '@blog/ai'],
    images: {
        domains: ['res.cloudinary.com'],
    },
    experimental: {
        outputFileTracingRoot: require('path').join(__dirname, '../../'),
    },
};

module.exports = nextConfig;
