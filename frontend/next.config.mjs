/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        BACKEND_URL: 'http://localhost:3001'
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
