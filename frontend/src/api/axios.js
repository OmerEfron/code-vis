import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

// Create axios instance with configuration
const api = axios.create({
    baseURL: BACKEND_URL,
    headers: {
        'Content-Type': 'application/json'
    },
});

// Add response interceptor for better error handling
api.interceptors.response.use(
    response => response,
    error => {
        if (error.code === 'ERR_NETWORK') {
            console.error('Network Error - Please check if the backend server is running on:', BACKEND_URL);
            throw new Error(`Network Error - Backend server not accessible at ${BACKEND_URL}. Please ensure the server is running.`);
        }
        // Add more detailed error information
        const errorMessage = error.response?.data?.error || error.message || 'An error occurred';
        console.error('API Error:', {
            status: error.response?.status,
            message: errorMessage,
            endpoint: error.config?.url
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