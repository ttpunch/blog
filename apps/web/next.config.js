/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    transpilePackages: ['@blog/api', '@blog/db', '@blog/ai', 'three', '@react-three/fiber', '@react-three/drei'],
    images: {
        domains: ['res.cloudinary.com'],
    },
    experimental: {
        outputFileTracingRoot: require('path').join(__dirname, '../../'),
    },
};

module.exports = nextConfig;
