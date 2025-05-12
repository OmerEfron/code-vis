/** @type {import('next').NextConfig} */
const nextConfig = {
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
