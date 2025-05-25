// Environment configuration
const config = {
    // API Configuration
    BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000',
    
    // Development settings
    IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
    IS_PRODUCTION: process.env.NODE_ENV === 'production',
    
    // Optional: Analytics & Monitoring
    SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    ANALYTICS_ID: process.env.NEXT_PUBLIC_ANALYTICS_ID,
    
    // API Settings
    API_TIMEOUT: 30000, // 30 seconds
    
    // Feature flags (can be controlled via environment variables)
    FEATURES: {
        ENABLE_ANALYTICS: !!process.env.NEXT_PUBLIC_ANALYTICS_ID,
        ENABLE_ERROR_TRACKING: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
        ENABLE_DEBUG_LOGS: process.env.NODE_ENV === 'development',
    }
};

// Validation function to check required environment variables
export const validateEnvironment = () => {
    const errors = [];
    
    if (!config.BACKEND_URL) {
        errors.push('NEXT_PUBLIC_BACKEND_URL is required');
    }
    
    if (errors.length > 0) {
        console.error('Environment validation failed:', errors);
        throw new Error(`Environment configuration errors: ${errors.join(', ')}`);
    }
    
    if (config.IS_DEVELOPMENT) {
        console.log('Environment configuration loaded:', {
            BACKEND_URL: config.BACKEND_URL,
            NODE_ENV: process.env.NODE_ENV,
            FEATURES: config.FEATURES
        });
    }
};

export default config; 