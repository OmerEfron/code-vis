'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import CodeInput from './CodeInput';
import MetaphorSelector from './MetaphorSelector';
import { Alert, Button, Card, ProgressBar } from './ui';
import { analyzeCode, getExamples } from '../api/axios';
import { useVisualization } from '../hooks/useVisualization';

// Dynamically import AlgorithmVisualization with SSR disabled
const AlgorithmVisualization = dynamic(
    () => import('./AlgorithmVisualization'),
    { ssr: false }
);

export default function CodeAnalyzer() {
    const [code, setCode] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const [selectedMetaphor, setSelectedMetaphor] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState(null);
    const [examples, setExamples] = useState([]);
    const [selectedExample, setSelectedExample] = useState(null);

    // Use the visualization hook
    const {
        loading: visualizing,
        error: visualizationError,
        visualization,
        currentStep,
        totalSteps,
        hasNext,
        hasPrevious,
        progress,
        generateVisualization,
        getScenarios,
        nextStep,
        previousStep,
        goToStep,
        reset: resetVisualization,
        clearVisualization
    } = useVisualization();

    useEffect(() => {
        fetchExamples();
    }, []);

    const fetchExamples = async () => {
        try {
            const data = await getExamples();
            if (data.success) {
                setExamples(data.examples);
            }
        } catch (error) {
            console.error('Error fetching examples:', error);
            setError(error.message);
            setExamples([]);
        }
    };

    const handleExampleSelect = async (example) => {
        setSelectedExample(example);
        setCode('');
        setAnalysis(example.analysis);
        setSelectedMetaphor(example.analysis.metaphors?.[0] || null);
        setError(null);
        clearVisualization();
    };

    const handleAnalyzeCode = async () => {
        try {
            setIsAnalyzing(true);
            setError(null);
            clearVisualization();
            
            const data = await analyzeCode(code);
            if (!data.success) {
                throw new Error(data.error || 'Failed to analyze code');
            }

            setAnalysis(data.analysis);
            setSelectedMetaphor(null);
        } catch (err) {
            console.error('Analysis error:', err);
            setError(err.message);
            setAnalysis(null);
            setSelectedMetaphor(null);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const loadExample = async () => {
        try {
            const data = await getExamples();
            if (data.success && data.examples.length > 0) {
                const example = data.examples[0];
                setCode(example.analysis.code);
                setAnalysis(example.analysis);
                setSelectedMetaphor(example.analysis.metaphors[0]);
                setError(null);
                clearVisualization();
            }
        } catch (error) {
            console.error('Error loading example:', error);
            setError(error.message);
            setCode('');
            setAnalysis(null);
            setSelectedMetaphor(null);
        }
    };

    const handleMetaphorSelect = async (metaphor) => {
        setSelectedMetaphor(metaphor);
        
        if (code && code.trim()) {
            try {
                await generateVisualization(code, 'sorting');
            } catch (error) {
                console.error('Visualization generation error:', error);
            }
        }
    };

    const renderExamples = () => (
        <Card className="mb-6">
            <Card.Header>
                <Card.Title>Example Visualizations</Card.Title>
                <Card.Subtitle>Explore pre-built algorithm demonstrations</Card.Subtitle>
            </Card.Header>
            <Card.Body>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {examples.map((example) => (
                        <Card
                            key={example.id}
                            className="cursor-pointer transition-all hover:shadow-lg"
                            style={{
                                transform: selectedExample?.id === example.id ? 'translateY(-2px)' : 'none',
                                borderColor: selectedExample?.id === example.id ? 'var(--color-primary-500)' : undefined,
                                backgroundColor: selectedExample?.id === example.id ? 'var(--color-primary-50)' : undefined
                            }}
                            onClick={() => handleExampleSelect(example)}
                        >
                            <Card.Body>
                                <Card.Title as="h4" className="mb-2">
                                    {example.metadata.algorithmType}
                                </Card.Title>
                                <div className="text-sm mb-3 flex items-center gap-2">
                                    <span style={{ color: 'var(--color-text-secondary)' }}>
                                        Time: {example.metadata.complexity.time}
                                    </span>
                                    <span style={{ color: 'var(--color-text-tertiary)' }}>|</span>
                                    <span style={{ color: 'var(--color-text-secondary)' }}>
                                        Space: {example.metadata.complexity.space}
                                    </span>
                                </div>
                                <div className="text-xs flex items-center" style={{ color: 'var(--color-text-tertiary)' }}>
                                    <span>📅</span>
                                    <span className="ml-1">
                                        {new Date(example.metadata.savedAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            </Card.Body>
        </Card>
    );

    const renderError = () => error && (
        <Alert 
            variant="error" 
            title="Error" 
            className="mb-6"
            onClose={() => setError(null)}
        >
            <p>{error}</p>
            {error.includes('Backend server not accessible') && (
                <div className="mt-2 text-sm">
                    <p>Please check:</p>
                    <ul className="list-disc ml-5 mt-1">
                        <li>The backend server is running on port 3000</li>
                        <li>There are no CORS issues</li>
                        <li>The NEXT_PUBLIC_BACKEND_URL environment variable is set correctly</li>
                    </ul>
                </div>
            )}
        </Alert>
    );

    const renderVisualizationError = () => visualizationError && (
        <Alert 
            variant="error" 
            title="Visualization Error" 
            className="mb-4"
            onClose={() => clearVisualization()}
        >
            {visualizationError}
        </Alert>
    );

    const renderAlgorithmAnalysis = () => analysis && (
        <Card className="mb-6">
            <Card.Header>
                <Card.Title>Algorithm Analysis</Card.Title>
                <Card.Subtitle>Detailed analysis of your code</Card.Subtitle>
            </Card.Header>
            <Card.Body>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-neutral-50)' }}>
                        <p className="text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                            Algorithm Type
                        </p>
                        <p style={{ color: 'var(--color-text-primary)' }}>
                            {analysis?.algorithm?.algorithmType || 'N/A'}
                        </p>
                    </div>
                    <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-neutral-50)' }}>
                        <p className="text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                            Category
                        </p>
                        <p style={{ color: 'var(--color-text-primary)' }}>
                            {analysis?.algorithm?.category || 'N/A'}
                        </p>
                    </div>
                    <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-neutral-50)' }}>
                        <p className="text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                            Time Complexity
                        </p>
                        <p style={{ color: 'var(--color-text-primary)' }}>
                            {analysis?.algorithm?.timeComplexity || 'N/A'}
                        </p>
                    </div>
                    <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-neutral-50)' }}>
                        <p className="text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                            Space Complexity
                        </p>
                        <p style={{ color: 'var(--color-text-primary)' }}>
                            {analysis?.algorithm?.spaceComplexity || 'N/A'}
                        </p>
                    </div>
                </div>
                
                <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-neutral-50)' }}>
                    <p className="text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                        Explanation
                    </p>
                    <p style={{ color: 'var(--color-text-primary)', lineHeight: 'var(--leading-relaxed)' }}>
                        {analysis?.algorithm?.explanation || 'No explanation available.'}
                    </p>
                </div>
            </Card.Body>
        </Card>
    );

    const renderVisualizationControls = () => visualization && (
        <Card className="mb-6">
            <Card.Header>
                <div className="flex justify-between items-center">
                    <div>
                        <Card.Title>Visualization Controls</Card.Title>
                        <Card.Subtitle>Step through the algorithm execution</Card.Subtitle>
                    </div>
                    <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        Step {currentStep + 1} of {totalSteps}
                    </div>
                </div>
            </Card.Header>
            <Card.Body>
                <div className="mb-4">
                    <ProgressBar
                        value={currentStep + 1}
                        max={totalSteps}
                        label="Progress"
                        showPercentage={true}
                    />
                </div>
                
                <div className="flex items-center justify-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!hasPrevious}
                        onClick={previousStep}
                    >
                        ← Previous
                    </Button>
                    
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetVisualization}
                    >
                        Reset
                    </Button>
                    
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!hasNext}
                        onClick={nextStep}
                    >
                        Next →
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );

    return (
        <div className="container mx-auto min-h-screen" style={{ 
            backgroundColor: 'var(--color-background)', 
            padding: 'var(--space-6)' 
        }}>
            {renderError()}
            {renderExamples()}
            
            <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                        🎯 CodeViz2 Algorithm Explorer
                    </h1>
                    <p className="text-xl mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                        Transform your code into beautiful, interactive visualizations with real-world metaphors
                    </p>
                    <div className="flex justify-center items-center gap-6">
                        <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-success-500)' }}></span>
                            <span>AI-Powered Analysis</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-primary-500)' }}></span>
                            <span>Interactive Learning</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-secondary-500)' }}></span>
                            <span>Real-World Metaphors</span>
                        </div>
                    </div>
                    <div className="mt-6">
                        <Button
                            variant="outline"
                            onClick={loadExample}
                            className="flex items-center gap-2"
                        >
                            <span>🚀</span>
                            Try Example Algorithm
                        </Button>
                    </div>
                </div>

                {/* Code Input */}
                <Card>
                    <Card.Header>
                        <Card.Title>🔬 Algorithm Code Analysis</Card.Title>
                        <Card.Subtitle>Paste your algorithm and watch the magic happen! Our AI will identify patterns and create engaging visualizations.</Card.Subtitle>
                    </Card.Header>
                    <Card.Body>
                        <CodeInput
                            value={code}
                            onChange={setCode}
                            isLoading={isAnalyzing}
                            error={error}
                        />
                        
                        <div className="flex justify-end mt-4">
                            <Button
                                onClick={handleAnalyzeCode}
                                disabled={isAnalyzing || !code.trim()}
                                loading={isAnalyzing}
                                size="lg"
                                className="px-8"
                            >
                                {isAnalyzing ? '🔍 Analyzing Your Code...' : '✨ Create Visualization'}
                            </Button>
                        </div>
                    </Card.Body>
                </Card>

                {/* Algorithm Analysis */}
                {renderAlgorithmAnalysis()}

                {/* Metaphor Selection */}
                {analysis?.metaphors && (
                    <Card>
                        <Card.Header>
                            <Card.Title>Metaphor Selection</Card.Title>
                            <Card.Subtitle>Choose how you'd like to visualize the algorithm</Card.Subtitle>
                        </Card.Header>
                        <Card.Body>
                            <MetaphorSelector
                                metaphors={analysis.metaphors}
                                onSelect={handleMetaphorSelect}
                                selected={selectedMetaphor}
                            />
                        </Card.Body>
                    </Card>
                )}

                {/* Visualization Error */}
                {renderVisualizationError()}

                {/* Visualization Controls */}
                {renderVisualizationControls()}

                {/* Visualization Display */}
                {selectedMetaphor && visualization && (
                    <Card>
                        <Card.Header>
                            <Card.Title>Interactive Visualization</Card.Title>
                            <Card.Subtitle>
                                {selectedMetaphor.name} - {selectedMetaphor.description}
                            </Card.Subtitle>
                        </Card.Header>
                        <Card.Body>
                            <div className="canvas-container">
                                <AlgorithmVisualization
                                    data={{
                                        success: true,
                                        analysis: {
                                            metaphors: [selectedMetaphor],
                                            inputs: analysis?.inputs || { inputs: [], examples: [] },
                                            algorithm: analysis?.algorithm || {}
                                        }
                                    }}
                                />
                            </div>
                        </Card.Body>
                    </Card>
                )}

                {/* Loading state for visualization */}
                {visualizing && selectedMetaphor && (
                    <Card>
                        <Card.Body>
                            <div className="flex items-center justify-center p-8">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="loading-spinner-lg" />
                                    <p style={{ color: 'var(--color-text-secondary)' }}>
                                        Generating visualization...
                                    </p>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                )}
            </div>
        </div>
    );
} 