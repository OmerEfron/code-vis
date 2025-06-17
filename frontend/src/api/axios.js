import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

const api = axios.create({
    baseURL: BACKEND_URL,
    timeout: 30000, // Increased for LLM calls
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor for logging
api.interceptors.request.use(
    config => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    error => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
api.interceptors.response.use(
    response => {
        console.log(`API Response: ${response.status} ${response.config.url}`);
        return response;
    },
    error => {
        if (error.code === 'ECONNABORTED') {
            console.error('Request Timeout');
            throw new Error('Request timeout - Please try again');
        }
        
        if (error.code === 'ERR_NETWORK') {
            console.error('Network Error - Backend server not accessible:', BACKEND_URL);
            throw new Error(`Cannot connect to backend server at ${BACKEND_URL}`);
        }

        const errorMessage = error.response?.data?.error || error.message || 'An error occurred';
        console.error('API Error:', {
            status: error.response?.status,
            message: errorMessage,
            endpoint: error.config?.url
        });
        
        throw new Error(errorMessage);
    }
);

export const analyzeHuffman = async (inputString) => {
    try {
        const response = await api.post('/api/algorithms/hoffman', { 
            hoffmanCode: inputString 
        });
        return response.data;
    } catch (error) {
        console.error('Huffman Analysis Error:', error);
        throw error;
    }
};

export const analyzeCode = async (code) => {
    try {
        const response = await api.post('/api/analyze', { 
            code: code 
        });
        return response.data;
    } catch (error) {
        console.error('Code Analysis Error:', error);
        throw error;
    }
};

export const getExamples = async () => {
    try {
        const response = await api.get('/api/examples');
        return response.data;
    } catch (error) {
        console.error('Examples Error:', error);
        throw error;
    }
};

export const getVisualizationConfig = async (algorithmType) => {
    try {
        const response = await api.get(`/api/visualization/${algorithmType}`);
        return response.data;
    } catch (error) {
        console.error('Visualization Config Error:', error);
        throw error;
    }
};

export default api; 