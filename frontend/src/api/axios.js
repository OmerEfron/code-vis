import axios from 'axios';
import config from '../config/environment';

const BACKEND_URL = config.BACKEND_URL;

// Create axios instance with configuration
const api = axios.create({
    baseURL: BACKEND_URL,
    timeout: config.API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true, // Enable credentials for CORS
});

// Add request interceptor for logging
api.interceptors.request.use(
    requestConfig => {
        if (config.FEATURES.ENABLE_DEBUG_LOGS) {
            console.log(`API Request: ${requestConfig.method?.toUpperCase()} ${requestConfig.url}`);
        }
        return requestConfig;
    },
    error => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
    response => {
        if (config.FEATURES.ENABLE_DEBUG_LOGS) {
            console.log(`API Response: ${response.status} ${response.config.url}`);
        }
        return response;
    },
    error => {
        // Handle different types of errors
        if (error.code === 'ECONNABORTED') {
            console.error('Request Timeout - The request took too long to complete');
            throw new Error('Request timeout - Please try again');
        }
        
        if (error.code === 'ERR_NETWORK') {
            console.error('Network Error - Please check if the backend server is running on:', BACKEND_URL);
            throw new Error(`Network Error - Backend server not accessible at ${BACKEND_URL}. Please ensure the server is running.`);
        }

        // Handle rate limiting
        if (error.response?.status === 429) {
            console.error('Rate limit exceeded');
            throw new Error('Too many requests - Please wait a moment before trying again');
        }

        // Handle CORS errors
        if (error.response?.status === 403 && error.response?.data?.error?.includes('CORS')) {
            console.error('CORS Error:', error.response.data.error);
            throw new Error('Access denied - CORS policy violation');
        }

        // Add more detailed error information
        const errorMessage = error.response?.data?.error || error.message || 'An error occurred';
        console.error('API Error:', {
            status: error.response?.status,
            message: errorMessage,
            endpoint: error.config?.url,
            timestamp: new Date().toISOString()
        });
        
        throw new Error(errorMessage);
    }
);

export const analyzeCode = async (code) => {
    try {
        // Updated to match backend route
        const response = await api.post('/api/analyze', { code });
        return response.data;
    } catch (error) {
        console.error('Analysis Error:', error);
        throw error; // Let the interceptor handle the error
    }
};

export const getExamples = async () => {
    try {
        const response = await api.get('/api/examples');
        return response.data;
    } catch (error) {
        console.error('Examples Error:', error);
        throw error; // Let the interceptor handle the error
    }
};

export default api; 