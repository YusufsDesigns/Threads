/** @type {import('next').NextConfig} */
const nextConfig = {
        experimental: {
        serverComponentsExternalPackages: ["mongoose"],
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: "img.clerk.com",
                port: '',
            },
            {
                protocol: "https",
                hostname: "images.clerk.dev",
                port: '',
            },
            {
                protocol: "https",
                hostname: "utfs.io",
                port: '',
            },
            {
                protocol: "https",
                hostname: "placehold.co",
                port: '',
            },
        ],
    },
};

module.exports = nextConfig;
