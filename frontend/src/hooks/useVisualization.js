import { useState, useCallback } from 'react';
import api from '../api/axios';

export const useVisualization = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [visualization, setVisualization] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);

    const generateVisualization = useCallback(async (code, scenario = 'sorting', data = null) => {
        setLoading(true);
        setError(null);
        setVisualization(null);
        setCurrentStep(0);

        try {
            const requestBody = { code, scenario };
            if (data && Array.isArray(data)) {
                requestBody.data = data;
            }

            const response = await api.post('/api/visualization/generate', requestBody);
            
            if (response.data && response.data.success) {
                setVisualization(response.data.data);
                return response.data.data;
            } else {
                throw new Error(response.data?.error || 'Failed to generate visualization');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message || 'Failed to generate visualization';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const getScenarios = useCallback(async () => {
        try {
            const response = await api.get('/api/visualization/scenarios');
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch scenarios';
            setError(errorMessage);
            throw new Error(errorMessage);
        }
    }, []);

    const nextStep = useCallback(() => {
        if (visualization && currentStep < visualization.visualization.states.length - 1) {
            setCurrentStep(prev => prev + 1);
            return true;
        }
        return false;
    }, [visualization, currentStep]);

    const previousStep = useCallback(() => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
            return true;
        }
        return false;
    }, [currentStep]);

    const goToStep = useCallback((step) => {
        if (visualization && step >= 0 && step < visualization.visualization.states.length) {
            setCurrentStep(step);
            return true;
        }
        return false;
    }, [visualization]);

    const reset = useCallback(() => {
        setCurrentStep(0);
        setError(null);
    }, []);

    const clearVisualization = useCallback(() => {
        setVisualization(null);
        setCurrentStep(0);
        setError(null);
    }, []);

    // Computed values
    const currentState = visualization?.visualization?.states?.[currentStep] || null;
    const totalSteps = visualization?.visualization?.metadata?.totalSteps || 0;
    const hasNext = currentStep < totalSteps - 1;
    const hasPrevious = currentStep > 0;
    const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

    return {
        // State
        loading,
        error,
        visualization,
        currentStep,
        currentState,
        totalSteps,
        hasNext,
        hasPrevious,
        progress,

        // Actions
        generateVisualization,
        getScenarios,
        nextStep,
        previousStep,
        goToStep,
        reset,
        clearVisualization
    };
}; 