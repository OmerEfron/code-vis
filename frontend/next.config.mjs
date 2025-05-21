/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    server: {
        port: 3001
    },
    env: {
        BACKEND_URL: 'http://localhost:3000'
    },
    webpack: (config) => {
        // This will completely ignore the 'canvas' module
        config.resolve.fallback = {
            ...config.resolve.fallback,
            canvas: false,
        };
        return config;
    },
}

export default nextConfig;
