'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import CodeInput from './CodeInput';
import MetaphorSelector from './MetaphorSelector';
import { EXAMPLE_CODE, EXAMPLE_ANALYSIS } from '../constants/exampleAnalysis';

// Dynamically import AlgorithmVisualization with SSR disabled
const AlgorithmVisualization = dynamic(
    () => import('./AlgorithmVisualization'),
    { ssr: false }
);

const generateVisualizationStates = (algorithm, metaphor) => {
    if (!algorithm || !metaphor) return [];

    // Extract metaphor properties
    const {
        steps,
        elements,
        visualProperties
    } = metaphor;

    // Initialize visualization states array
    const states = [];

    // Create initial state
    states.push({
        papers: Object.keys(elements).map((element, index) => ({
            score: element,
            position: { x: null, y: null },
            highlighted: false,
            description: elements[element]
        })),
        description: steps[0],
        complexity: {
            comparisons: 0,
            arrayAccesses: 0,
            currentMemoryUsage: { 
                main: Object.keys(elements).length,
                auxiliary: 2,
                total: Object.keys(elements).length + 5
            }
        },
        visualElements: {
            piles: [{
                papers: Object.keys(elements).map(element => ({
                    score: element,
                    position: { x: null, y: null },
                    description: elements[element]
                }))
            }],
            comparisons: []
        }
    });

    // Generate states for each step in the metaphor
    steps.slice(1).forEach((step, stepIndex) => {
        const currentElements = Object.keys(elements);
        const primaryElements = visualProperties.primaryElements || [];
        
        states.push({
            papers: currentElements.map((element, index) => ({
                score: element,
                position: { x: null, y: null },
                highlighted: primaryElements.includes(element),
                description: elements[element]
            })),
            description: step,
            complexity: {
                comparisons: stepIndex + 1,
                arrayAccesses: stepIndex + 1,
                currentMemoryUsage: {
                    main: currentElements.length,
                    auxiliary: 2,
                    total: currentElements.length + 5
                }
            },
            visualElements: {
                piles: [{
                    papers: currentElements
                        .filter(element => primaryElements.includes(element))
                        .map(element => ({
                            score: element,
                            position: { x: null, y: null },
                            description: elements[element]
                        }))
                }],
                comparisons: primaryElements.length > 1 ? [{
                    from: { value: primaryElements[0] },
                    to: { value: primaryElements[1] }
                }] : []
            }
        });
    });

    // Add final state
    states.push({
        papers: Object.keys(elements).map((element, index) => ({
            score: element,
            position: { x: null, y: null },
            highlighted: visualProperties.primaryElements?.includes(element),
            description: elements[element]
        })),
        description: "Visualization complete",
        complexity: {
            comparisons: steps.length - 1,
            arrayAccesses: steps.length - 1,
            currentMemoryUsage: {
                main: Object.keys(elements).length,
                auxiliary: 2,
                total: Object.keys(elements).length + 5
            }
        },
        visualElements: {
            piles: [{
                papers: Object.keys(elements)
                    .filter(element => visualProperties.primaryElements?.includes(element))
                    .map(element => ({
                        score: element,
                        position: { x: null, y: null },
                        description: elements[element]
                    }))
            }],
            comparisons: []
        }
    });

    return states;
};

export default function CodeAnalyzer() {
    const [code, setCode] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const [selectedMetaphor, setSelectedMetaphor] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState(null);
    const [visualizationStates, setVisualizationStates] = useState([]);

    const analyzeCode = async () => {
        try {
            setIsAnalyzing(true);
            setError(null);
            
            const response = await fetch('http://localhost:3000/api/llm/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code })
            });

            const data = await response.json();
            if (!data.success) {
                throw new Error(data.error || 'Failed to analyze code');
            }

            setAnalysis(data.analysis);
            setSelectedMetaphor(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const loadExample = () => {
        setCode(EXAMPLE_CODE);
        setAnalysis(EXAMPLE_ANALYSIS.analysis);
        setSelectedMetaphor(null);
        setError(null);
    };

    const handleMetaphorSelect = (metaphor) => {
        setSelectedMetaphor(metaphor);
        // Generate visualization states when metaphor is selected
        const states = generateVisualizationStates(analysis?.algorithm, metaphor);
        setVisualizationStates(states);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Code Analyzer</h1>
                    <button
                        onClick={loadExample}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                    >
                        Load Example
                    </button>
                </div>

                <div className="space-y-4">
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Enter your code here..."
                        className="w-full h-64 p-4 bg-gray-50 rounded-lg border border-gray-200 font-mono text-sm"
                    />
                    
                    <div className="flex justify-end">
                        <button
                            onClick={analyzeCode}
                            disabled={isAnalyzing || !code.trim()}
                            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                        >
                            {isAnalyzing ? 'Analyzing...' : 'Analyze Code'}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                {analysis && (
                    <div className="space-y-6">
                        {/* Algorithm Analysis */}
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Algorithm Analysis</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Type</p>
                                    <p className="mt-1">{analysis.algorithm.algorithmType}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Category</p>
                                    <p className="mt-1">{analysis.algorithm.category}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Time Complexity</p>
                                    <p className="mt-1">{analysis.algorithm.timeComplexity}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Space Complexity</p>
                                    <p className="mt-1">{analysis.algorithm.spaceComplexity}</p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <p className="text-sm font-medium text-gray-500">Explanation</p>
                                <p className="mt-1">{analysis.algorithm.explanation}</p>
                            </div>
                        </div>

                        {/* Metaphor Selection */}
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Choose a Metaphor</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {analysis.metaphors.map((metaphor) => (
                                    <button
                                        key={metaphor.name}
                                        onClick={() => setSelectedMetaphor(metaphor)}
                                        className={`p-4 rounded-lg border-2 transition-all ${
                                            selectedMetaphor?.name === metaphor.name
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-blue-200'
                                        }`}
                                    >
                                        <h3 className="font-medium text-gray-900">{metaphor.name}</h3>
                                        <p className="text-sm text-gray-500 mt-1">{metaphor.description}</p>
                                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded mt-2">
                                            {metaphor.learningStyle}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Visualization */}
                        {selectedMetaphor && (
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <AlgorithmVisualization
                                    data={{
                                        metaphors: [selectedMetaphor],
                                        inputs: analysis.inputs,
                                        algorithm: analysis.algorithm
                                    }}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
} 