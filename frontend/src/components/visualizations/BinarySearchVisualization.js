'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BinarySearchVisualization({ array = [], target = null, speed = 800 }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [searchSteps, setSearchSteps] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [leftPointer, setLeftPointer] = useState(-1);
    const [rightPointer, setRightPointer] = useState(-1);
    const [midPointer, setMidPointer] = useState(-1);
    const [found, setFound] = useState(false);
    const [currentRange, setCurrentRange] = useState([]);

    useEffect(() => {
        if (array && array.length > 0 && target !== null) {
            generateSearchSteps(array, target);
        }
    }, [array, target]);

    const generateSearchSteps = (arr, searchTarget) => {
        const steps = [];
        let left = 0;
        let right = arr.length - 1;
        let stepCount = 0;
        
        // Initial step
        steps.push({
            step: stepCount++,
            left,
            right,
            mid: -1,
            range: Array.from({ length: arr.length }, (_, i) => i),
            description: `Starting binary search for ${searchTarget} in sorted array`,
            comparison: null,
            found: false,
            eliminated: []
        });

        const eliminated = [];

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            
            // Show mid calculation
            steps.push({
                step: stepCount++,
                left,
                right,
                mid,
                range: Array.from({ length: right - left + 1 }, (_, i) => left + i),
                description: `Calculate mid = (${left} + ${right}) / 2 = ${mid}`,
                comparison: null,
                found: false,
                eliminated: [...eliminated]
            });

            // Show comparison
            if (arr[mid] === searchTarget) {
                steps.push({
                    step: stepCount++,
                    left,
                    right,
                    mid,
                    range: [mid],
                    description: `arr[${mid}] = ${arr[mid]} equals target ${searchTarget}. Found!`,
                    comparison: 'equal',
                    found: true,
                    eliminated: [...eliminated]
                });
                break;
            } else if (arr[mid] < searchTarget) {
                // Eliminate left half
                for (let i = left; i <= mid; i++) {
                    eliminated.push(i);
                }
                
                steps.push({
                    step: stepCount++,
                    left,
                    right,
                    mid,
                    range: Array.from({ length: right - left + 1 }, (_, i) => left + i),
                    description: `arr[${mid}] = ${arr[mid]} < ${searchTarget}. Search right half.`,
                    comparison: 'less',
                    found: false,
                    eliminated: [...eliminated]
                });
                
                left = mid + 1;
            } else {
                // Eliminate right half
                for (let i = mid; i <= right; i++) {
                    eliminated.push(i);
                }
                
                steps.push({
                    step: stepCount++,
                    left,
                    right,
                    mid,
                    range: Array.from({ length: right - left + 1 }, (_, i) => left + i),
                    description: `arr[${mid}] = ${arr[mid]} > ${searchTarget}. Search left half.`,
                    comparison: 'greater',
                    found: false,
                    eliminated: [...eliminated]
                });
                
                right = mid - 1;
            }
        }

        if (left > right) {
            steps.push({
                step: stepCount++,
                left,
                right,
                mid: -1,
                range: [],
                description: `Target ${searchTarget} not found in array. Search space exhausted.`,
                comparison: 'not_found',
                found: false,
                eliminated: [...eliminated]
            });
        }

        setSearchSteps(steps);
        setCurrentStep(0);
        if (steps.length > 0) {
            const step = steps[0];
            setLeftPointer(step.left);
            setRightPointer(step.right);
            setMidPointer(step.mid);
            setFound(step.found);
            setCurrentRange(step.range);
        }
    };

    const playAnimation = async () => {
        if (isPlaying || searchSteps.length === 0) return;
        
        setIsPlaying(true);
        
        for (let i = currentStep; i < searchSteps.length; i++) {
            const step = searchSteps[i];
            setCurrentStep(i);
            setLeftPointer(step.left);
            setRightPointer(step.right);
            setMidPointer(step.mid);
            setFound(step.found);
            setCurrentRange(step.range);
            
            await new Promise(resolve => setTimeout(resolve, speed));
            
            if (!isPlaying) break;
        }
        
        setIsPlaying(false);
    };

    const stopAnimation = () => {
        setIsPlaying(false);
    };

    const resetAnimation = () => {
        setIsPlaying(false);
        setCurrentStep(0);
        if (searchSteps.length > 0) {
            const step = searchSteps[0];
            setLeftPointer(step.left);
            setRightPointer(step.right);
            setMidPointer(step.mid);
            setFound(step.found);
            setCurrentRange(step.range);
        }
    };

    const goToStep = (stepIndex) => {
        if (stepIndex >= 0 && stepIndex < searchSteps.length) {
            const step = searchSteps[stepIndex];
            setCurrentStep(stepIndex);
            setLeftPointer(step.left);
            setRightPointer(step.right);
            setMidPointer(step.mid);
            setFound(step.found);
            setCurrentRange(step.range);
        }
    };

    const getElementColor = (index) => {
        const currentStepData = searchSteps[currentStep];
        if (!currentStepData) return 'var(--color-primary-500)';
        
        if (found && index === midPointer) return 'var(--color-success-500)';
        if (currentStepData.eliminated.includes(index)) return 'var(--color-neutral-400)';
        if (index === midPointer) return 'var(--color-warning-500)';
        if (currentRange.includes(index)) return 'var(--color-secondary-500)';
        return 'var(--color-neutral-300)';
    };

    const getPointerLabel = (index) => {
        const labels = [];
        if (index === leftPointer) labels.push('L');
        if (index === rightPointer) labels.push('R');
        if (index === midPointer) labels.push('M');
        return labels.join(',');
    };

    const currentStepData = searchSteps[currentStep];

    if (!array || array.length === 0 || target === null) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="text-4xl mb-2">🔍</div>
                    <p style={{ color: 'var(--color-text-secondary)' }}>
                        Provide a sorted array and target value to visualize binary search
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
            className="w-full max-w-5xl mx-auto p-6"
        >
            {/* Header */}
            <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                    Binary Search Visualization
                </h3>
                <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                    Searching for <span className="font-bold text-lg" style={{ color: 'var(--color-primary-600)' }}>{target}</span> in sorted array
                </p>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    Binary search efficiently finds elements by repeatedly dividing the search space in half
                </p>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-4 mb-6 p-4 rounded-lg border" 
                 style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border-default)' }}>
                <motion.button
                    onClick={playAnimation}
                    disabled={isPlaying || currentStep >= searchSteps.length - 1}
                    className={`
                        flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
                        ${isPlaying || currentStep >= searchSteps.length - 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-green-500 text-white hover:bg-green-600 shadow-md hover:shadow-lg'
                        }
                    `}
                    whileHover={!isPlaying && currentStep < searchSteps.length - 1 ? { scale: 1.05 } : {}}
                    whileTap={!isPlaying && currentStep < searchSteps.length - 1 ? { scale: 0.95 } : {}}
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
                        value={speed}
                        onChange={(e) => setSpeed(parseInt(e.target.value))}
                        className="px-3 py-1 rounded border text-sm"
                        style={{ 
                            backgroundColor: 'var(--color-surface)', 
                            borderColor: 'var(--color-border-default)',
                            color: 'var(--color-text-primary)'
                        }}
                    >
                        <option value={300}>Fast</option>
                        <option value={500}>Medium</option>
                        <option value={800}>Normal</option>
                        <option value={1200}>Slow</option>
                        <option value={1800}>Very Slow</option>
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
                    style={{ 
                        backgroundColor: found ? 'var(--color-success-50)' : 'var(--color-surface)', 
                        borderColor: found ? 'var(--color-success-300)' : 'var(--color-border-default)' 
                    }}
                >
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                            Step {currentStep + 1} of {searchSteps.length}
                        </h4>
                        {found && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-800"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Found!
                            </motion.div>
                        )}
                    </div>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        {currentStepData.description}
                    </p>
                    
                    {/* Search space info */}
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <span className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>Left:</span>
                            <span className="ml-2" style={{ color: 'var(--color-text-primary)' }}>
                                {leftPointer >= 0 ? leftPointer : 'N/A'}
                            </span>
                        </div>
                        <div>
                            <span className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>Right:</span>
                            <span className="ml-2" style={{ color: 'var(--color-text-primary)' }}>
                                {rightPointer >= 0 ? rightPointer : 'N/A'}
                            </span>
                        </div>
                        <div>
                            <span className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>Mid:</span>
                            <span className="ml-2" style={{ color: 'var(--color-text-primary)' }}>
                                {midPointer >= 0 ? midPointer : 'N/A'}
                            </span>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Array Visualization */}
            <div className="mb-6 p-6 rounded-lg border" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border-default)' }}>
                <div className="flex flex-wrap items-center justify-center gap-2">
                    {array.map((value, index) => (
                        <motion.div
                            key={index}
                            className="relative flex flex-col items-center"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            {/* Pointer Labels */}
                            {getPointerLabel(index) && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute -top-8 text-xs font-bold px-2 py-1 rounded"
                                    style={{ 
                                        backgroundColor: index === midPointer ? 'var(--color-warning-500)' : 'var(--color-primary-500)',
                                        color: 'white'
                                    }}
                                >
                                    {getPointerLabel(index)}
                                </motion.div>
                            )}
                            
                            {/* Array Element */}
                            <motion.div
                                className="w-12 h-12 rounded-lg border-2 border-white shadow-lg flex items-center justify-center font-bold text-white"
                                style={{ backgroundColor: getElementColor(index) }}
                                animate={{
                                    backgroundColor: getElementColor(index),
                                    scale: index === midPointer ? 1.1 : 1,
                                    y: index === midPointer ? -5 : 0
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                {value}
                            </motion.div>
                            
                            {/* Index Label */}
                            <span className="mt-1 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                                {index}
                            </span>
                        </motion.div>
                    ))}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap items-center justify-center gap-6 mt-6 pt-4 border-t" style={{ borderColor: 'var(--color-border-default)' }}>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: 'var(--color-secondary-500)' }}></div>
                        <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Active Range</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: 'var(--color-warning-500)' }}></div>
                        <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Mid Point (M)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: 'var(--color-success-500)' }}></div>
                        <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Target Found</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: 'var(--color-neutral-400)' }}></div>
                        <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Eliminated</span>
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
                        max={searchSteps.length - 1}
                        value={currentStep}
                        onChange={(e) => goToStep(parseInt(e.target.value))}
                        className="mx-2"
                    />
                    <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                        {currentStep + 1}/{searchSteps.length}
                    </span>
                </div>

                <motion.button
                    onClick={() => goToStep(Math.min(searchSteps.length - 1, currentStep + 1))}
                    disabled={currentStep >= searchSteps.length - 1}
                    className={`
                        flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all
                        ${currentStep >= searchSteps.length - 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg'
                        }
                    `}
                    whileHover={currentStep < searchSteps.length - 1 ? { scale: 1.05 } : {}}
                    whileTap={currentStep < searchSteps.length - 1 ? { scale: 0.95 } : {}}
                >
                    Next
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </motion.button>
            </div>

            {/* Complexity Info */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-6 p-4 rounded-lg border"
                style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border-default)' }}
            >
                <h5 className="font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                    Algorithm Complexity
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>Time Complexity:</span>
                        <span className="ml-2" style={{ color: 'var(--color-text-primary)' }}>O(log n)</span>
                    </div>
                    <div>
                        <span className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>Space Complexity:</span>
                        <span className="ml-2" style={{ color: 'var(--color-text-primary)' }}>O(1)</span>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
} 