'use client';

import { useState, useEffect } from 'react';
import { analyzeHuffman } from '@/api/axios';
import HuffmanVisualization from '@/components/HuffmanVisualization';
import CodeAnalyzer from '@/components/CodeAnalyzer';
import Welcome from '@/components/Welcome';
import Examples from '@/components/Examples';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
    const [currentView, setCurrentView] = useState('welcome'); // 'welcome', 'huffman', 'analyze', 'examples'
    const [inputString, setInputString] = useState('');
    const [steps, setSteps] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showWelcome, setShowWelcome] = useState(true);

    // Check if user has seen welcome before
    useEffect(() => {
        const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
        if (hasSeenWelcome) {
            setShowWelcome(false);
            setCurrentView('huffman');
        }
    }, []);

    const handleWelcomeAction = (action) => {
        localStorage.setItem('hasSeenWelcome', 'true');
        setShowWelcome(false);
        
        switch (action) {
            case 'huffman':
                setCurrentView('huffman');
                break;
            case 'analyze':
                setCurrentView('analyze');
                break;
            case 'examples':
                setCurrentView('examples');
                break;
            default:
                setCurrentView('huffman');
        }
    };

    const handleSkipWelcome = () => {
        localStorage.setItem('hasSeenWelcome', 'true');
        setShowWelcome(false);
        setCurrentView('huffman');
    };

    const handleHuffmanSubmit = async (e) => {
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
        setAnalysisResult(null);
    };

    const handleAnalysisComplete = (result) => {
        setAnalysisResult(result);
    };

    const navigationItems = [
        { key: 'huffman', label: 'Huffman Encoding', icon: '🌳' },
        { key: 'analyze', label: 'Code Analyzer', icon: '🔍' },
        { key: 'examples', label: 'Examples', icon: '📖' }
    ];

    if (showWelcome) {
        return <Welcome onGetStarted={handleWelcomeAction} onSkip={handleSkipWelcome} />;
    }

    return (
        <main className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
            {/* Header with Navigation */}
            <motion.header 
                className="border-b bg-white shadow-sm sticky top-0 z-10"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="container mx-auto max-w-6xl px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Algorithm Visualizer
                            </h1>
                            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
                                AI-Powered
                            </span>
                        </div>
                        
                        <nav className="flex gap-2">
                            {navigationItems.map((item) => (
                                <Button
                                    key={item.key}
                                    variant={currentView === item.key ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setCurrentView(item.key)}
                                    className="flex items-center gap-2"
                                >
                                    <span>{item.icon}</span>
                                    {item.label}
                                </Button>
                            ))}
                            
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setShowWelcome(true);
                                    localStorage.removeItem('hasSeenWelcome');
                                }}
                                className="ml-2"
                            >
                                ❓ Help
                            </Button>
                        </nav>
                    </div>
                </div>
            </motion.header>

            <div className="container mx-auto max-w-6xl p-8">
                <AnimatePresence mode="wait">
                    {currentView === 'huffman' && (
                        <motion.div
                            key="huffman"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="mb-8">
                                <h1 className="text-4xl font-bold mb-4 text-center" style={{ color: 'var(--color-text-primary)' }}>
                                    Huffman Code Visualization
                                </h1>
                                <p className="text-lg mb-8 text-center" style={{ color: 'var(--color-text-secondary)' }}>
                                    Enter a string to see how Huffman encoding works step by step
                                </p>
                            </div>
                            
                            <Card className="mb-8">
                                <form onSubmit={handleHuffmanSubmit} className="space-y-6">
                                    <div>
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
                                            <motion.p 
                                                className="mt-2 text-sm" 
                                                style={{ color: 'var(--color-error-600)' }}
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                {error}
                                            </motion.p>
                                        )}
                                    </div>
                                    
                                    <div className="flex justify-center gap-4">
                                        <Button
                                            type="submit"
                                            disabled={isLoading || !inputString.trim()}
                                            className="px-8 py-3 text-white"
                                        >
                                            {isLoading ? (
                                                <span className="flex items-center gap-2">
                                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                                    Analyzing...
                                                </span>
                                            ) : (
                                                'Generate Huffman Code'
                                            )}
                                        </Button>

                                        {steps && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={handleReset}
                                            >
                                                Reset
                                            </Button>
                                        )}
                                    </div>
                                </form>
                            </Card>

                            {/* Huffman Visualization */}
                            {steps && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <HuffmanVisualization 
                                        steps={steps} 
                                        inputString={inputString.trim()}
                                    />
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {currentView === 'analyze' && (
                        <motion.div
                            key="analyze"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="mb-8">
                                <h1 className="text-4xl font-bold mb-4 text-center" style={{ color: 'var(--color-text-primary)' }}>
                                    AI Code Analyzer
                                </h1>
                                <p className="text-lg mb-8 text-center" style={{ color: 'var(--color-text-secondary)' }}>
                                    Paste any algorithm code for instant AI-powered analysis and visualization suggestions
                                </p>
                            </div>
                            
                            <CodeAnalyzer onAnalysisComplete={handleAnalysisComplete} />
                        </motion.div>
                    )}

                    {currentView === 'examples' && (
                        <motion.div
                            key="examples"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Examples />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
