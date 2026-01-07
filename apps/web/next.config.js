/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@blog/api', '@blog/db', '@blog/ai'],
    images: {
        domains: ['res.cloudinary.com'],
    },
};

module.exports = nextConfig;
