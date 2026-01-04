/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@blog/api', '@blog/db'],
    images: {
        domains: ['res.cloudinary.com'],
    },
};

module.exports = nextConfig;
