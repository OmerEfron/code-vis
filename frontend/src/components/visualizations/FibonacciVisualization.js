'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FibonacciVisualization({ n = 20, speed = 500 }) {
    // Guard against invalid input
    if (!Number.isInteger(n) || n <= 0) {
        return (
            <div className="p-8 text-center text-red-600">
                Invalid value for n. Please provide a positive integer.
            </div>
        );
    }

    const [sequenceLength, setSequenceLength] = useState(n);
    const [steps, setSteps] = useState([[0], [0, 1]]); // each element is a sequence slice
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [animationSpeed, setAnimationSpeed] = useState(speed);

    // Re-initialize if n changes
    useEffect(() => {
        // regenerate steps when length changes
        const newSteps = [];
        const seq = [0, 1];
        newSteps.push([0]);
        newSteps.push([0, 1]);
        for (let i = 2; i < sequenceLength; i++) {
            seq.push(seq[i - 1] + seq[i - 2]);
            newSteps.push([...seq]);
        }
        setSteps(newSteps);
        setCurrentStep(0);
        setIsPlaying(false);
    }, [sequenceLength]);

    const playAnimation = async () => {
        if (isPlaying) return;
        setIsPlaying(true);

        for (let i = currentStep; i < steps.length; i++) {
            setCurrentStep(i);
            await new Promise((resolve) => setTimeout(resolve, animationSpeed));
            if (!isPlaying) break;
        }

        setIsPlaying(false);
    };

    const stopAnimation = () => setIsPlaying(false);

    const resetAnimation = () => {
        setIsPlaying(false);
        setCurrentStep(0);
    };

    const currentSequence = steps[currentStep] || [0];
    const maxVal = Math.max(...currentSequence, 1);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-3xl mx-auto p-6"
        >
            {/* Header */}
            <div className="mb-6 text-center">
                <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                    Fibonacci Sequence Visualization
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    Observe how each number is the sum of the two preceding ones
                </p>
            </div>

            {/* Controls */}
            <div
                className="flex flex-wrap items-center justify-center gap-4 mb-6 p-4 rounded-lg border"
                style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border-default)' }}
            >
                <motion.button
                    onClick={playAnimation}
                    disabled={isPlaying || currentStep >= steps.length - 1}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        isPlaying || currentStep >= steps.length - 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-green-500 text-white hover:bg-green-600 shadow-md hover:shadow-lg'
                    }`}
                    whileHover={!isPlaying && currentStep < steps.length - 1 ? { scale: 1.05 } : {}}
                    whileTap={!isPlaying && currentStep < steps.length - 1 ? { scale: 0.95 } : {}}
                >
                    {isPlaying ? 'Playing…' : 'Play'}
                </motion.button>

                <motion.button
                    onClick={stopAnimation}
                    disabled={!isPlaying}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        !isPlaying
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg'
                    }`}
                    whileHover={isPlaying ? { scale: 1.05 } : {}}
                    whileTap={isPlaying ? { scale: 0.95 } : {}}
                >
                    Stop
                </motion.button>

                <motion.button
                    onClick={resetAnimation}
                    className="px-4 py-2 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Reset
                </motion.button>

                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                        Length (n):
                    </label>
                    <input
                        type="number"
                        min="2"
                        max="40"
                        value={sequenceLength}
                        onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (val >= 2 && val <= 40) {
                                setSequenceLength(val);
                                resetAnimation();
                            }
                        }}
                        className="w-20 px-2 py-1 border rounded text-sm"
                        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border-default)', color: 'var(--color-text-primary)' }}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                        Speed:
                    </label>
                    <select
                        value={animationSpeed}
                        onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
                        className="px-3 py-1 rounded border text-sm"
                        style={{
                            backgroundColor: 'var(--color-surface)',
                            borderColor: 'var(--color-border-default)',
                            color: 'var(--color-text-primary)'
                        }}
                    >
                        <option value={100}>Very Fast</option>
                        <option value={300}>Fast</option>
                        <option value={500}>Normal</option>
                        <option value={800}>Slow</option>
                        <option value={1200}>Very Slow</option>
                    </select>
                </div>

                <motion.button
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0 || isPlaying}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        currentStep === 0 || isPlaying
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg'
                    }`}
                    whileHover={currentStep > 0 && !isPlaying ? { scale: 1.05 } : {}}
                    whileTap={currentStep > 0 && !isPlaying ? { scale: 0.95 } : {}}
                >
                    Previous
                </motion.button>

                <motion.button
                    onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                    disabled={currentStep >= steps.length - 1 || isPlaying}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        currentStep >= steps.length - 1 || isPlaying
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg'
                    }`}
                    whileHover={currentStep < steps.length - 1 && !isPlaying ? { scale: 1.05 } : {}}
                    whileTap={currentStep < steps.length - 1 && !isPlaying ? { scale: 0.95 } : {}}
                >
                    Next
                </motion.button>
            </div>

            {/* Visualization */}
            <div
                className="p-6 rounded-lg border"
                style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border-default)' }}
            >
                <div className="flex items-end justify-center gap-2 h-64">
                    {currentSequence.map((value, idx) => (
                        <motion.div
                            key={`${idx}-${value}`}
                            className="flex flex-col items-center gap-1"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3, delay: idx * 0.05 }}
                        >
                            <motion.div
                                className="rounded-t-lg border-2 border-white shadow-lg"
                                style={{
                                    width: '32px',
                                    height: `${(value / maxVal) * 200}px`,
                                    backgroundColor:
                                        idx === currentStep
                                            ? 'var(--color-primary-500)'
                                            : 'var(--color-neutral-300)'
                                }}
                                animate={{
                                    backgroundColor:
                                        idx === currentStep
                                            ? 'var(--color-primary-500)'
                                            : 'var(--color-neutral-300)',
                                    scale: idx === currentStep ? 1.1 : 1,
                                    y: idx === currentStep ? -10 : 0
                                }}
                                transition={{ duration: 0.3 }}
                            />
                            <span
                                className="text-xs font-medium"
                                style={{ color: 'var(--color-text-primary)' }}
                            >
                                {value}
                            </span>
                            <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                                {idx}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Sequence values */}
            <div className="mt-6 text-center text-sm" style={{ color: 'var(--color-text-primary)' }}>
                {currentSequence.join(', ')}
            </div>
        </motion.div>
    );
} 