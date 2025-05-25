'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import CodeInput from './CodeInput';
import MetaphorSelector from './MetaphorSelector';
import { analyzeCode, getExamples } from '../api/axios';

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
    const [examples, setExamples] = useState([]);
    const [selectedExample, setSelectedExample] = useState(null);

    useEffect(() => {
        // Fetch examples when component mounts
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
            setExamples([]); // Set empty array on error
        }
    };

    const handleExampleSelect = async (example) => {
        setSelectedExample(example);
        setCode('');
        setAnalysis(example.analysis);
        setSelectedMetaphor(example.analysis.metaphors?.[0] || null);
    };

    const handleAnalyzeCode = async () => {
        try {
            setIsAnalyzing(true);
            setError(null);
            
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
            }
        } catch (error) {
            console.error('Error loading example:', error);
            setError(error.message);
            setCode('');
            setAnalysis(null);
            setSelectedMetaphor(null);
        }
    };

    const handleMetaphorSelect = (metaphor) => {
        setSelectedMetaphor(metaphor);
        // Generate visualization states when metaphor is selected
        const states = generateVisualizationStates(analysis?.algorithm, metaphor);
        setVisualizationStates(states);
    };

    const renderExamples = () => (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-indigo-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Example Visualizations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {examples.map((example) => (
                    <div
                        key={example.id}
                        className={`p-5 rounded-xl cursor-pointer transition-all transform hover:scale-102 hover:shadow-md ${
                            selectedExample?.id === example.id
                                ? 'bg-indigo-100 border-2 border-indigo-500 shadow-md'
                                : 'bg-gray-50 hover:bg-indigo-50 border-2 border-transparent'
                        }`}
                        onClick={() => handleExampleSelect(example)}
                    >
                        <div className="font-semibold text-gray-900">{example.metadata.algorithmType}</div>
                        <div className="text-sm text-gray-700 mt-2 flex items-center gap-2">
                            <span>Time: {example.metadata.complexity.time}</span>
                            <span className="text-gray-400">|</span>
                            <span>Space: {example.metadata.complexity.space}</span>
                        </div>
                        <div className="text-xs text-gray-600 mt-3 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(example.metadata.savedAt).toLocaleDateString()}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderError = () => error && (
        <div className="p-6 bg-red-50 text-red-700 rounded-xl border border-red-200">
            <div className="flex items-center gap-3 mb-2">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold">Error</h3>
            </div>
            <p className="ml-9">{error}</p>
            {error.includes('Backend server not accessible') && (
                <div className="ml-9 mt-2 text-sm">
                    <p>Please check:</p>
                    <ul className="list-disc ml-5 mt-1">
                        <li>The backend server is running on port 3000</li>
                        <li>There are no CORS issues</li>
                        <li>The NEXT_PUBLIC_BACKEND_URL environment variable is set correctly (if using custom URL)</li>
                    </ul>
                </div>
            )}
        </div>
    );

    return (
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
            {renderError()}
            {renderExamples()}
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Code Analyzer
                    </h1>
                    <button
                        onClick={loadExample}
                        className="px-6 py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-all shadow-sm border border-gray-200 hover:border-gray-300 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Load Example
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="relative">
                        <textarea
                            value={code || ''}
                            onChange={(e) => setCode(e.target.value || '')}
                            placeholder="Enter your code here..."
                            className="w-full h-72 p-5 bg-white rounded-xl border border-gray-200 font-mono text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all"
                        />
                        <div className="absolute bottom-4 right-4">
                            <button
                                onClick={handleAnalyzeCode}
                                disabled={isAnalyzing || !(code || '').trim()}
                                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center gap-2"
                            >
                                {isAnalyzing ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                        Analyze Code
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {analysis && (
                    <div className="space-y-8">
                        {/* Algorithm Analysis */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Algorithm Analysis</h2>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <p className="text-sm font-medium text-gray-700">Type</p>
                                    <p className="mt-2 text-gray-900">{analysis?.algorithm?.algorithmType || 'N/A'}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <p className="text-sm font-medium text-gray-700">Category</p>
                                    <p className="mt-2 text-gray-900">{analysis?.algorithm?.category || 'N/A'}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <p className="text-sm font-medium text-gray-700">Time Complexity</p>
                                    <p className="mt-2 text-gray-900">{analysis?.algorithm?.timeComplexity || 'N/A'}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <p className="text-sm font-medium text-gray-700">Space Complexity</p>
                                    <p className="mt-2 text-gray-900">{analysis?.algorithm?.spaceComplexity || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <p className="text-sm font-medium text-gray-700">Explanation</p>
                                <p className="mt-2 text-gray-900 leading-relaxed">{analysis?.algorithm?.explanation || 'No explanation available.'}</p>
                            </div>
                        </div>

                        {/* Metaphor Selection */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Choose a Metaphor</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {(analysis?.metaphors || []).map((metaphor) => (
                                    <button
                                        key={metaphor?.name || Math.random()}
                                        onClick={() => setSelectedMetaphor(metaphor)}
                                        className={`p-5 rounded-xl transition-all transform hover:scale-102 text-left ${
                                            selectedMetaphor?.name === metaphor?.name
                                                ? 'bg-blue-50 border-2 border-blue-500'
                                                : 'bg-gray-50 border-2 border-transparent hover:border-blue-200'
                                        }`}
                                    >
                                        <h3 className="font-semibold text-gray-900">{metaphor?.name || 'Unnamed Metaphor'}</h3>
                                        <p className="text-sm text-gray-700 mt-2">{metaphor?.description || 'No description available.'}</p>
                                        <span className="inline-block px-3 py-1 bg-white text-gray-700 text-xs font-medium rounded-full mt-3 shadow-sm border border-gray-200">
                                            {metaphor?.learningStyle || 'General'}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Visualization */}
                        {selectedMetaphor && (
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Visualization</h2>
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
                        )}
                    </div>
                )}
            </div>
        </div>
    );
} 