'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Card from './ui/Card';
import Button from './ui/Button';
import Alert from './ui/Alert';
import { analyzeCode } from '@/api/axios';

export default function CodeAnalyzer({ onAnalysisComplete }) {
    const [code, setCode] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const [unknownAlgorithm, setUnknownAlgorithm] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState(null);

    const handleAnalyze = async () => {
        if (!code.trim()) {
            setError('Please enter some code to analyze');
            return;
        }

        setIsAnalyzing(true);
        setError(null);

        try {
            const result = await analyzeCode(code);
            setAnalysis(result);

            // Detect unknown algorithm response
            const algType = result?.analysis?.algorithm?.algorithmType?.toLowerCase() || '';
            if (algType.includes('unknown')) {
                setUnknownAlgorithm(true);
            }

            if (onAnalysisComplete) {
                onAnalysisComplete(result);
            }
        } catch (err) {
            setError(err.message || 'Failed to analyze code');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleReset = () => {
        setAnalysis(null);
        setError(null);
        setUnknownAlgorithm(false);
    };

    const insertExampleCode = (exampleCode) => {
        setCode(exampleCode);
        setError(null);
        setAnalysis(null);
    };

    const renderVisualization = () => {
        if (!analysis?.analysis?.algorithm?.algorithmType) return null;
        
        const algorithmType = analysis.analysis.algorithm.algorithmType.toLowerCase();
        
        // Import visualization components dynamically
        const BubbleSortVisualization = dynamic(() => import('./visualizations/BubbleSortVisualization'), {
            loading: () => <div className="p-8 text-center">Loading visualization...</div>
        });
        
        const BinarySearchVisualization = dynamic(() => import('./visualizations/BinarySearchVisualization'), {
            loading: () => <div className="p-8 text-center">Loading visualization...</div>
        });

        const FibonacciVisualization = dynamic(() => import('./visualizations/FibonacciVisualization'), {
            loading: () => <div className="p-8 text-center">Loading visualization...</div>
        });

        // Extract parameters from analysis or use defaults
        const getVisualizationProps = () => {
            // The backend may return inputs as an object { inputs: [...], examples: [...] } or directly as an array.
            const rawInputs = analysis.analysis?.inputs;
            const inputs = Array.isArray(rawInputs) ? rawInputs : Array.isArray(rawInputs?.inputs) ? rawInputs.inputs : [];
            
            if (algorithmType.includes('bubble') || algorithmType.includes('sort')) {
                const arrayInput = inputs.find(i => i.type?.includes('array') || i.name?.includes('arr'));
                return {
                    array: [64, 34, 25, 12, 22, 11, 90],
                    speed: 500
                };
            }
            
            if (algorithmType.includes('fibonacci')) {
                const nInput = inputs.find(i => i.name?.toLowerCase().includes('n'));
                return {
                    n: (typeof nInput?.example === 'number' && nInput.example > 0) ? nInput.example : 10,
                    speed: 500
                };
            }
            
            if (algorithmType.includes('binary') && algorithmType.includes('search')) {
                return {
                    array: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19],
                    target: 7,
                    speed: 800
                };
            }
            
            return {};
        };

        const props = getVisualizationProps();

        if (algorithmType.includes('bubble') || (algorithmType.includes('sort') && !algorithmType.includes('quick'))) {
            return (
                <Card>
                    <h4 className="text-lg font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                        🎮 Interactive Visualization
                    </h4>
                    <BubbleSortVisualization {...props} />
                </Card>
            );
        }
        
        if (algorithmType.includes('fibonacci')) {
            return (
                <Card>
                    <h4 className="text-lg font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                        🎮 Interactive Visualization
                    </h4>
                    <FibonacciVisualization {...props} />
                </Card>
            );
        }
        
        if (algorithmType.includes('binary') && algorithmType.includes('search')) {
            return (
                <Card>
                    <h4 className="text-lg font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                        🎮 Interactive Visualization
                    </h4>
                    <BinarySearchVisualization {...props} />
                </Card>
            );
        }
        
        return (
            <Card>
                <h4 className="text-lg font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                    🎮 Interactive Visualization
                </h4>
                <div className="p-8 rounded-lg border border-dashed" style={{ borderColor: 'var(--color-border-default)' }}>
                    <div className="text-center">
                        <div className="text-4xl mb-4">🚧</div>
                        <h5 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                            Visualization Coming Soon
                        </h5>
                        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                            We're working on creating a visualization for <strong>{analysis.analysis.algorithm.algorithmType}</strong>. 
                            Currently available: Bubble Sort, Binary Search, Fibonacci, and Huffman Encoding.
                        </p>
                    </div>
                </div>
            </Card>
        );
    };

    const exampleCodes = [
        {
            name: "Binary Search",
            code: `function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1;
}`
        },
        {
            name: "Bubble Sort",
            code: `function bubbleSort(arr) {
    const n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap elements
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
    
    return arr;
}`
        },
        {
            name: "Fibonacci Sequence",
            code: `function fibonacci(n) {
    if (n <= 1) {
        return n;
    }
    
    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) {
        let temp = a + b;
        a = b;
        b = temp;
    }
    
    return b;
}`
        }
    ];

    // Render special panel for unknown algorithm
    if (unknownAlgorithm && analysis) {
        return (
            <div className="space-y-6">
                <Card>
                    <div className="text-center space-y-4 p-8">
                        <h3 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                            🤔 Unrecognized Algorithm
                        </h3>
                        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                            {analysis.analysis?.algorithm?.explanation || 'The provided algorithm could not be identified.'}
                        </p>
                        <Button onClick={handleReset}>OK</Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                            Algorithm Code Analyzer
                        </h3>
                        <div className="flex gap-2">
                            {exampleCodes.map((example, index) => (
                                <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => insertExampleCode(example.code)}
                                    disabled={isAnalyzing}
                                >
                                    {example.name}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label 
                            htmlFor="code-input"
                            className="block text-sm font-medium mb-2"
                            style={{ color: 'var(--color-text-primary)' }}
                        >
                            Enter your algorithm code:
                        </label>
                        <textarea
                            id="code-input"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Paste or type your algorithm code here..."
                            className="w-full h-64 p-4 border rounded-lg font-mono text-sm resize-vertical focus:outline-none focus:ring-2"
                            style={{
                                backgroundColor: 'var(--color-surface)',
                                borderColor: error ? 'var(--color-error-500)' : 'var(--color-border-default)',
                                color: 'var(--color-text-primary)',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '14px',
                                lineHeight: '1.5'
                            }}
                            disabled={isAnalyzing}
                        />
                    </div>

                    {error && (
                        <Alert variant="destructive">
                            {error}
                        </Alert>
                    )}

                    <div className="flex gap-3">
                        <Button
                            onClick={handleAnalyze}
                            disabled={isAnalyzing || !code.trim()}
                            className="flex-1"
                        >
                            {isAnalyzing ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    Analyzing with AI...
                                </span>
                            ) : (
                                '🔍 Analyze Code'
                            )}
                        </Button>

                        {analysis && (
                            <Button
                                variant="outline"
                                onClick={handleReset}
                                disabled={isAnalyzing}
                            >
                                Reset
                            </Button>
                        )}
                    </div>
                </div>
            </Card>

            {/* Analysis Results */}
            {analysis && (
                <div className="space-y-4">
                    {/* Interactive Visualization */}
                    {renderVisualization()}

                    {/* Algorithm Details */}
                    <Card>
                        <h4 className="text-lg font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                            Algorithm Analysis
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                                    Algorithm Type:
                                </span>
                                <p className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                                    {analysis.analysis?.algorithm?.algorithmType || 'Unknown'}
                                </p>
                            </div>
                            <div>
                                <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                                    Category:
                                </span>
                                <p className="text-lg" style={{ color: 'var(--color-text-primary)' }}>
                                    {analysis.analysis?.algorithm?.category || 'Unknown'}
                                </p>
                            </div>
                            <div>
                                <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                                    Time Complexity:
                                </span>
                                <p className="text-lg font-mono font-bold" style={{ color: 'var(--color-primary-600)' }}>
                                    {analysis.analysis?.algorithm?.timeComplexity || 'Unknown'}
                                </p>
                            </div>
                            <div>
                                <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                                    Space Complexity:
                                </span>
                                <p className="text-lg font-mono font-bold" style={{ color: 'var(--color-primary-600)' }}>
                                    {analysis.analysis?.algorithm?.spaceComplexity || 'Unknown'}
                                </p>
                            </div>
                        </div>

                        {analysis.analysis?.algorithm?.explanation && (
                            <div>
                                <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                                    Explanation:
                                </span>
                                <p className="mt-1" style={{ color: 'var(--color-text-primary)' }}>
                                    {analysis.analysis.algorithm.explanation}
                                </p>
                            </div>
                        )}
                    </Card>

                    {/* Metaphors */}
                    {analysis.analysis?.metaphors && analysis.analysis.metaphors.length > 0 && (
                        <Card>
                            <h4 className="text-lg font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                                Learning Metaphors
                            </h4>
                            
                            <div className="space-y-4">
                                {analysis.analysis.metaphors.map((metaphor, index) => (
                                    <div key={index} className="border rounded-lg p-4" style={{ borderColor: 'var(--color-border-default)' }}>
                                        <div className="flex justify-between items-start mb-2">
                                            <h5 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                                                {metaphor.name}
                                            </h5>
                                            <span className="text-xs px-2 py-1 rounded" style={{ 
                                                backgroundColor: 'var(--color-primary-100)',
                                                color: 'var(--color-primary-700)'
                                            }}>
                                                {metaphor.learningStyle}
                                            </span>
                                        </div>
                                        
                                        <p className="text-sm mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                                            {metaphor.description}
                                        </p>

                                        {metaphor.steps && metaphor.steps.length > 0 && (
                                            <div>
                                                <span className="text-xs font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
                                                    Steps:
                                                </span>
                                                <ol className="list-decimal list-inside mt-1 space-y-1">
                                                    {metaphor.steps.map((step, stepIndex) => (
                                                        <li key={stepIndex} className="text-sm" style={{ color: 'var(--color-text-primary)' }}>
                                                            {step}
                                                        </li>
                                                    ))}
                                                </ol>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    {/* Input Examples */}
                    {analysis.analysis?.inputs && analysis.analysis.inputs.length > 0 && (
                        <Card>
                            <h4 className="text-lg font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                                Input Parameters & Examples
                            </h4>
                            
                            <div className="space-y-4">
                                {analysis.analysis.inputs.map((input, index) => (
                                    <div key={index} className="border-l-4 pl-4" style={{ borderColor: 'var(--color-primary-300)' }}>
                                        <div className="flex gap-2 items-center mb-1">
                                            <span className="font-mono font-bold" style={{ color: 'var(--color-text-primary)' }}>
                                                {input.name}
                                            </span>
                                            <span className="text-xs px-2 py-1 rounded" style={{ 
                                                backgroundColor: 'var(--color-neutral-100)',
                                                color: 'var(--color-text-secondary)'
                                            }}>
                                                {input.type}
                                            </span>
                                        </div>
                                        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                                            {input.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
} 