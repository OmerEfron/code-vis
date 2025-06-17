'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from './ui/Card';
import Button from './ui/Button';

export default function Welcome({ onGetStarted, onSkip }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [showDemo, setShowDemo] = useState(false);

    const features = [
        {
            icon: "🤖",
            title: "AI-Powered Analysis",
            description: "Our advanced AI analyzes your algorithm code and identifies patterns, complexity, and optimization opportunities.",
            demo: "Try pasting any sorting or searching algorithm to see instant analysis!"
        },
        {
            icon: "🎨",
            title: "Metaphor-Based Learning",
            description: "Complex algorithms become intuitive through real-world metaphors that match your learning style.",
            demo: "Binary search becomes like finding a book in a library using the catalog system."
        },
        {
            icon: "🎬",
            title: "Interactive Visualization",
            description: "Step through algorithms with smooth animations, playback controls, and interactive elements.",
            demo: "Watch Huffman encoding build a tree step-by-step with customizable speed controls."
        },
        {
            icon: "📚",
            title: "Multiple Learning Styles",
            description: "Visual, auditory, and kinesthetic approaches ensure everyone can understand algorithms effectively.",
            demo: "Choose from different metaphors and visualization styles that work best for you."
        }
    ];

    const quickStartOptions = [
        {
            title: "Analyze Your Code",
            description: "Paste algorithm code for AI analysis",
            action: "analyze",
            icon: "🔍",
            color: "primary"
        },
        {
            title: "Try Huffman Encoding",
            description: "See our complete visualization demo",
            action: "huffman",
            icon: "🌳",
            color: "secondary"
        },
        {
            title: "Browse Examples",
            description: "Explore pre-built algorithm examples",
            action: "examples",
            icon: "📖",
            color: "tertiary"
        }
    ];

    const handleQuickStart = (action) => {
        if (onGetStarted) {
            onGetStarted(action);
        }
    };

    const nextStep = () => {
        if (currentStep < features.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4" 
             style={{ backgroundColor: 'var(--color-background)' }}>
            <div className="max-w-4xl w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Algorithm Visualizer
                    </h1>
                    <p className="text-xl text-gray-600 mb-2">
                        Transform complex algorithms into intuitive, interactive learning experiences
                    </p>
                    <p className="text-lg text-gray-500">
                        Powered by AI • Designed for all learning styles • Built for understanding
                    </p>
                </motion.div>

                {!showDemo ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Card className="p-8 mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                <div>
                                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                                        Welcome to the Future of Algorithm Learning
                                    </h2>
                                    <p className="text-gray-600 mb-6">
                                        Whether you're a student learning your first sorting algorithm or 
                                        a developer optimizing complex systems, our AI-powered platform 
                                        makes algorithms accessible and engaging.
                                    </p>
                                    
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">✓</span>
                                            <span>Instant AI analysis of any algorithm code</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">✓</span>
                                            <span>Real-world metaphors for intuitive understanding</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">✓</span>
                                            <span>Interactive step-by-step visualizations</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="relative">
                                    <motion.div
                                        className="w-full h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200 flex items-center justify-center"
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="text-center">
                                            <motion.div
                                                animate={{ 
                                                    scale: [1, 1.1, 1],
                                                    rotate: [0, 5, -5, 0]
                                                }}
                                                transition={{ 
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    repeatType: "reverse"
                                                }}
                                                className="text-6xl mb-4"
                                            >
                                                🧠💡
                                            </motion.div>
                                            <p className="text-lg font-semibold text-gray-700">
                                                AI + Visualization + Learning
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Click "See How It Works" for a demo
                                            </p>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                            
                            <div className="flex justify-center gap-4 mt-8">
                                <Button 
                                    onClick={() => setShowDemo(true)}
                                    className="px-6 py-3"
                                >
                                    🎬 See How It Works
                                </Button>
                                <Button 
                                    variant="outline"
                                    onClick={() => handleQuickStart('huffman')}
                                    className="px-6 py-3"
                                >
                                    🚀 Jump to Demo
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="p-8 mb-6">
                                <div className="text-center mb-6">
                                    <div className="flex justify-center mb-4">
                                        <span className="text-6xl">{features[currentStep].icon}</span>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                                        {features[currentStep].title}
                                    </h3>
                                    <p className="text-lg text-gray-600 mb-4 max-w-2xl mx-auto">
                                        {features[currentStep].description}
                                    </p>
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
                                        <p className="text-sm text-blue-700">
                                            <strong>Example:</strong> {features[currentStep].demo}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex justify-between items-center">
                                    <Button 
                                        variant="outline"
                                        onClick={prevStep}
                                        disabled={currentStep === 0}
                                        className="flex items-center gap-2"
                                    >
                                        ← Previous
                                    </Button>
                                    
                                    <div className="flex gap-2">
                                        {features.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentStep(index)}
                                                className={`w-3 h-3 rounded-full transition-all ${
                                                    index === currentStep 
                                                        ? 'bg-blue-500' 
                                                        : 'bg-gray-300 hover:bg-gray-400'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    
                                    <Button 
                                        onClick={nextStep}
                                        disabled={currentStep === features.length - 1}
                                        className="flex items-center gap-2"
                                    >
                                        Next →
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    </AnimatePresence>
                )}

                {/* Quick Start Options */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: showDemo ? 0.5 : 0.4 }}
                >
                    <h3 className="text-xl font-bold text-center mb-6" style={{ color: 'var(--color-text-primary)' }}>
                        Ready to get started?
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {quickStartOptions.map((option, index) => (
                            <motion.div
                                key={option.action}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Card 
                                    className="p-6 cursor-pointer border-2 border-transparent hover:border-blue-300 transition-all"
                                    onClick={() => handleQuickStart(option.action)}
                                >
                                    <div className="text-center">
                                        <span className="text-3xl mb-3 block">{option.icon}</span>
                                        <h4 className="font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                                            {option.title}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            {option.description}
                                        </p>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                    
                    <div className="text-center">
                        <Button 
                            variant="outline"
                            onClick={onSkip}
                            className="text-sm"
                        >
                            Skip introduction
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
} 