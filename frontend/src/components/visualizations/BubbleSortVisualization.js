'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BubbleSortVisualization({ array = [], speed = 500 }) {
    // Local state for visualization
    const [animationSpeed, setAnimationSpeed] = useState(speed); // controls delay between steps
    const [currentArray, setCurrentArray] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [sortingSteps, setSortingSteps] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [comparingIndices, setComparingIndices] = useState([]);
    const [swappingIndices, setSwappingIndices] = useState([]);
    const [sortedIndices, setSortedIndices] = useState([]);

    useEffect(() => {
        if (array && array.length > 0) {
            generateSortingSteps(array);
        }
    }, [array]);

    const generateSortingSteps = (arr) => {
        const steps = [];
        const workingArray = [...arr];
        const n = workingArray.length;
        
        // Add initial state
        steps.push({
            array: [...workingArray],
            comparing: [],
            swapping: [],
            sorted: [],
            description: 'Initial array - ready to start bubble sort',
            iteration: 0,
            pass: 0
        });

        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                // Comparing step
                steps.push({
                    array: [...workingArray],
                    comparing: [j, j + 1],
                    swapping: [],
                    sorted: Array.from({ length: i }, (_, idx) => n - 1 - idx),
                    description: `Pass ${i + 1}: Comparing elements at positions ${j} and ${j + 1}`,
                    iteration: j + 1,
                    pass: i + 1
                });

                if (workingArray[j] > workingArray[j + 1]) {
                    // Swapping step
                    steps.push({
                        array: [...workingArray],
                        comparing: [j, j + 1],
                        swapping: [j, j + 1],
                        sorted: Array.from({ length: i }, (_, idx) => n - 1 - idx),
                        description: `Swapping ${workingArray[j]} and ${workingArray[j + 1]} (${workingArray[j]} > ${workingArray[j + 1]})`,
                        iteration: j + 1,
                        pass: i + 1
                    });

                    // Perform swap
                    [workingArray[j], workingArray[j + 1]] = [workingArray[j + 1], workingArray[j]];

                    // After swap state
                    steps.push({
                        array: [...workingArray],
                        comparing: [],
                        swapping: [],
                        sorted: Array.from({ length: i }, (_, idx) => n - 1 - idx),
                        description: `Swap complete - ${workingArray[j]} is now before ${workingArray[j + 1]}`,
                        iteration: j + 1,
                        pass: i + 1
                    });
                } else {
                    // No swap needed
                    steps.push({
                        array: [...workingArray],
                        comparing: [],
                        swapping: [],
                        sorted: Array.from({ length: i }, (_, idx) => n - 1 - idx),
                        description: `No swap needed - ${workingArray[j]} ≤ ${workingArray[j + 1]}`,
                        iteration: j + 1,
                        pass: i + 1
                    });
                }
            }
            
            // End of pass
            steps.push({
                array: [...workingArray],
                comparing: [],
                swapping: [],
                sorted: Array.from({ length: i + 1 }, (_, idx) => n - 1 - idx),
                description: `Pass ${i + 1} complete - element ${workingArray[n - 1 - i]} is in its final position`,
                iteration: 0,
                pass: i + 1
            });
        }

        // Final sorted state
        steps.push({
            array: [...workingArray],
            comparing: [],
            swapping: [],
            sorted: Array.from({ length: n }, (_, idx) => idx),
            description: 'Sorting complete! All elements are in their correct positions.',
            iteration: 0,
            pass: n
        });

        setSortingSteps(steps);
        setCurrentArray(steps[0]?.array || []);
        setCurrentStep(0);
    };

    const playAnimation = async () => {
        if (isPlaying || sortingSteps.length === 0) return;
        
        setIsPlaying(true);
        
        for (let i = currentStep; i < sortingSteps.length; i++) {
            const step = sortingSteps[i];
            setCurrentStep(i);
            setCurrentArray(step.array);
            setComparingIndices(step.comparing);
            setSwappingIndices(step.swapping);
            setSortedIndices(step.sorted);
            
            await new Promise(resolve => setTimeout(resolve, animationSpeed));
            
            if (!isPlaying) break; // Allow stopping
        }
        
        setIsPlaying(false);
    };

    const stopAnimation = () => {
        setIsPlaying(false);
    };

    const resetAnimation = () => {
        setIsPlaying(false);
        setCurrentStep(0);
        if (sortingSteps.length > 0) {
            const step = sortingSteps[0];
            setCurrentArray(step.array);
            setComparingIndices(step.comparing);
            setSwappingIndices(step.swapping);
            setSortedIndices(step.sorted);
        }
    };

    const goToStep = (stepIndex) => {
        if (stepIndex >= 0 && stepIndex < sortingSteps.length) {
            const step = sortingSteps[stepIndex];
            setCurrentStep(stepIndex);
            setCurrentArray(step.array);
            setComparingIndices(step.comparing);
            setSwappingIndices(step.swapping);
            setSortedIndices(step.sorted);
        }
    };

    const getBarColor = (index) => {
        if (sortedIndices.includes(index)) return 'var(--color-success-500)';
        if (swappingIndices.includes(index)) return 'var(--color-danger-500)';
        if (comparingIndices.includes(index)) return 'var(--color-warning-500)';
        return 'var(--color-primary-500)';
    };

    const getMaxValue = () => Math.max(...currentArray, 1);
    const currentStepData = sortingSteps[currentStep];

    if (!array || array.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="text-4xl mb-2">📊</div>
                    <p style={{ color: 'var(--color-text-secondary)' }}>
                        Provide an array to visualize bubble sort
                    </p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl mx-auto p-6"
        >
            {/* Header */}
            <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                    Bubble Sort Visualization
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    Watch how bubble sort compares adjacent elements and swaps them to sort the array
                </p>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-4 mb-6 p-4 rounded-lg border" 
                 style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border-default)' }}>
                <motion.button
                    onClick={playAnimation}
                    disabled={isPlaying || currentStep >= sortingSteps.length - 1}
                    className={`
                        flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
                        ${isPlaying || currentStep >= sortingSteps.length - 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-green-500 text-white hover:bg-green-600 shadow-md hover:shadow-lg'
                        }
                    `}
                    whileHover={!isPlaying && currentStep < sortingSteps.length - 1 ? { scale: 1.05 } : {}}
                    whileTap={!isPlaying && currentStep < sortingSteps.length - 1 ? { scale: 0.95 } : {}}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {isPlaying ? 'Playing...' : 'Play'}
                </motion.button>

                <motion.button
                    onClick={stopAnimation}
                    disabled={!isPlaying}
                    className={`
                        flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
                        ${!isPlaying 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg'
                        }
                    `}
                    whileHover={isPlaying ? { scale: 1.05 } : {}}
                    whileTap={isPlaying ? { scale: 0.95 } : {}}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h6v4H9z" />
                    </svg>
                    Stop
                </motion.button>

                <motion.button
                    onClick={resetAnimation}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reset
                </motion.button>

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
            </div>

            {/* Step Info */}
            {currentStepData && (
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-6 p-4 rounded-lg border"
                    style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border-default)' }}
                >
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                            Step {currentStep + 1} of {sortingSteps.length}
                        </h4>
                        <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                            Pass {currentStepData.pass} | Iteration {currentStepData.iteration}
                        </div>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        {currentStepData.description}
                    </p>
                </motion.div>
            )}

            {/* Visualization */}
            <div className="mb-6 p-6 rounded-lg border" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border-default)' }}>
                <div className="flex items-end justify-center gap-2 h-64">
                    {currentArray.map((value, index) => (
                        <motion.div
                            key={`${index}-${value}`}
                            className="flex flex-col items-center gap-2"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            <motion.div
                                className="rounded-t-lg border-2 border-white shadow-lg"
                                style={{
                                    width: '32px',
                                    height: `${(value / getMaxValue()) * 200}px`,
                                    backgroundColor: getBarColor(index),
                                    minHeight: '20px'
                                }}
                                animate={{
                                    backgroundColor: getBarColor(index),
                                    scale: swappingIndices.includes(index) ? 1.1 : 1,
                                    y: swappingIndices.includes(index) ? -10 : 0
                                }}
                                transition={{ duration: 0.3 }}
                            />
                            <motion.span
                                className="text-sm font-medium"
                                style={{ color: 'var(--color-text-primary)' }}
                                animate={{
                                    scale: comparingIndices.includes(index) || swappingIndices.includes(index) ? 1.2 : 1,
                                    fontWeight: comparingIndices.includes(index) || swappingIndices.includes(index) ? 'bold' : 'normal'
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                {value}
                            </motion.span>
                            <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                                {index}
                            </span>
                        </motion.div>
                    ))}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap items-center justify-center gap-6 mt-6 pt-4 border-t" style={{ borderColor: 'var(--color-border-default)' }}>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: 'var(--color-primary-500)' }}></div>
                        <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Unsorted</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: 'var(--color-warning-500)' }}></div>
                        <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Comparing</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: 'var(--color-danger-500)' }}></div>
                        <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Swapping</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: 'var(--color-success-500)' }}></div>
                        <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Sorted</span>
                    </div>
                </div>
            </div>

            {/* Step Navigation */}
            <div className="flex items-center justify-center gap-4">
                <motion.button
                    onClick={() => goToStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                    className={`
                        flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all
                        ${currentStep === 0
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg'
                        }
                    `}
                    whileHover={currentStep > 0 ? { scale: 1.05 } : {}}
                    whileTap={currentStep > 0 ? { scale: 0.95 } : {}}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                </motion.button>

                <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-default)' }}>
                    <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        Step:
                    </span>
                    <input
                        type="range"
                        min="0"
                        max={sortingSteps.length - 1}
                        value={currentStep}
                        onChange={(e) => goToStep(parseInt(e.target.value))}
                        className="mx-2"
                    />
                    <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                        {currentStep + 1}/{sortingSteps.length}
                    </span>
                </div>

                <motion.button
                    onClick={() => goToStep(Math.min(sortingSteps.length - 1, currentStep + 1))}
                    disabled={currentStep >= sortingSteps.length - 1}
                    className={`
                        flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all
                        ${currentStep >= sortingSteps.length - 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg'
                        }
                    `}
                    whileHover={currentStep < sortingSteps.length - 1 ? { scale: 1.05 } : {}}
                    whileTap={currentStep < sortingSteps.length - 1 ? { scale: 0.95 } : {}}
                >
                    Next
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </motion.button>
            </div>
        </motion.div>
    );
} 