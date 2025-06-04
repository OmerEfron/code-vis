'use client';

import { useState } from 'react';
import { analyzeHuffman } from '@/api/axios';
import HuffmanVisualization from '@/components/HuffmanVisualization';

export default function Home() {
    const [inputString, setInputString] = useState('');
    const [steps, setSteps] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!inputString.trim()) {
            setError('Please enter a string to encode');
            return;
        }

        setIsLoading(true);
        setError(null);
        setSteps(null);

        try {
            const response = await analyzeHuffman(inputString.trim());
            setSteps(response.steps || response);
            console.log('Received steps:', response);
        } catch (err) {
            setError(err.message || 'Failed to analyze Huffman encoding');
            console.error('Huffman analysis error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setSteps(null);
        setError(null);
    };

    return (
        <main className="min-h-screen p-8" style={{ backgroundColor: 'var(--color-background)' }}>
            <div className="container mx-auto max-w-6xl">
                <h1 className="text-4xl font-bold mb-4 text-center" style={{ color: 'var(--color-text-primary)' }}>
                    Huffman Code Visualization
                </h1>
                <p className="text-lg mb-8 text-center" style={{ color: 'var(--color-text-secondary)' }}>
                    Enter a string to see how Huffman encoding works step by step
                </p>
                
                <form onSubmit={handleSubmit} className="w-full mb-8">
                    <div className="mb-6">
                        <label 
                            htmlFor="string-input"
                            className="block text-lg font-medium mb-4"
                            style={{ color: 'var(--color-text-primary)' }}
                        >
                            Enter text to encode:
                        </label>
                        
                        <textarea
                            id="string-input"
                            value={inputString}
                            onChange={(e) => setInputString(e.target.value)}
                            placeholder="Type or paste your text here...
Example: 'hello world' or 'aavdvdsvvsdvsdq'"
                            disabled={isLoading}
                            className="w-full p-4 border rounded-lg text-base resize-vertical focus:outline-none focus:ring-2"
                            style={{
                                minHeight: '120px',
                                backgroundColor: isLoading ? 'var(--color-neutral-100)' : 'var(--color-surface)',
                                color: 'var(--color-text-primary)',
                                borderColor: error ? 'var(--color-error-500)' : 'var(--color-border-default)',
                                fontFamily: 'var(--font-mono)'
                            }}
                            onFocus={(e) => {
                                if (!error) {
                                    e.target.style.borderColor = 'var(--color-primary-500)';
                                    e.target.style.boxShadow = '0 0 0 2px var(--color-primary-100)';
                                }
                            }}
                            onBlur={(e) => {
                                if (!error) {
                                    e.target.style.borderColor = 'var(--color-border-default)';
                                    e.target.style.boxShadow = 'none';
                                }
                            }}
                        />
                        
                        {error && (
                            <p className="mt-2 text-sm" style={{ color: 'var(--color-error-600)' }}>
                                {error}
                            </p>
                        )}
                    </div>
                    
                    <div className="flex justify-center gap-4">
                        <button
                            type="submit"
                            disabled={isLoading || !inputString.trim()}
                            className="px-8 py-3 rounded-lg font-medium text-white transition-all"
                            style={{
                                backgroundColor: isLoading || !inputString.trim() 
                                    ? 'var(--color-neutral-400)' 
                                    : 'var(--color-primary-500)',
                                cursor: isLoading || !inputString.trim() ? 'not-allowed' : 'pointer'
                            }}
                            onMouseEnter={(e) => {
                                if (!isLoading && inputString.trim()) {
                                    e.target.style.backgroundColor = 'var(--color-primary-600)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isLoading && inputString.trim()) {
                                    e.target.style.backgroundColor = 'var(--color-primary-500)';
                                }
                            }}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    Analyzing...
                                </span>
                            ) : (
                                'Generate Huffman Code'
                            )}
                        </button>

                        {steps && (
                            <button
                                type="button"
                                onClick={handleReset}
                                className="px-6 py-3 rounded-lg font-medium transition-all border"
                                style={{
                                    backgroundColor: 'var(--color-surface)',
                                    color: 'var(--color-text-primary)',
                                    borderColor: 'var(--color-border-default)'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = 'var(--color-neutral-50)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = 'var(--color-surface)';
                                }}
                            >
                                Reset
                            </button>
                        )}
                    </div>
                </form>

                {/* Visualization Component */}
                {steps && (
                    <HuffmanVisualization 
                        steps={steps} 
                        inputString={inputString.trim()}
                    />
                )}
            </div>
        </main>
    );
}
