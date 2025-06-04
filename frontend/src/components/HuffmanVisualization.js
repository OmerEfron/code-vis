'use client';

import { useState, useEffect } from 'react';
import FrequencyChart from './huffman/FrequencyChart';
import TreeVisualization from './huffman/TreeVisualization';
import MergeProcess from './huffman/MergeProcess';
import CodeTable from './huffman/CodeTable';
import EncodingResult from './huffman/EncodingResult';

// Import 3D components
import FrequencyChart3D from './huffman/FrequencyChart3D';
import TreeVisualization3D from './huffman/TreeVisualization3D';
import MergeProcess3D from './huffman/MergeProcess3D';
import ProgressiveTree3D from './huffman/ProgressiveTree3D';

export default function HuffmanVisualization({ steps, inputString }) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playSpeed, setPlaySpeed] = useState(2000); // Slower for teaching
    const [is3DMode, setIs3DMode] = useState(true);
    const [teachingMode, setTeachingMode] = useState(true);

    // Auto-play functionality
    useEffect(() => {
        let interval;
        if (isPlaying && currentStepIndex < steps.length - 1) {
            interval = setInterval(() => {
                setCurrentStepIndex(prev => prev + 1);
            }, playSpeed);
        } else if (isPlaying && currentStepIndex >= steps.length - 1) {
            setIsPlaying(false);
        }

        return () => clearInterval(interval);
    }, [isPlaying, currentStepIndex, playSpeed, steps.length]);

    const currentStep = steps[currentStepIndex];
    const progress = ((currentStepIndex + 1) / steps.length) * 100;

    // Get progressive tree data up to current step
    const getProgressiveTreeData = () => {
        if (currentStepIndex < 1) return null; // No tree before step 2
        
        // For step 2: show first leaf node
        if (currentStep.step === 2) {
            const nodes = currentStep.data;
            if (nodes && nodes.length > 0) {
                return nodes[0]; // Show first character node
            }
            return null;
        }
        
        // For step 3: show progressive tree building
        if (currentStep.step === 3) {
            return buildTreeFromMergeSteps();
        }
        
        // For step 4 and 5: show final complete tree
        if (currentStep.step >= 4) {
            return buildCompleteTree();
        }
        
        return null;
    };
    
    // Build complete tree from all merge steps
    const buildCompleteTree = () => {
        const step2 = steps.find(s => s.step === 2);
        if (!step2) return null;
        
        const allMergeSteps = steps.filter(s => s.step === 3);
        let nodes = [...step2.data];
        
        // Apply all merge steps
        allMergeSteps.forEach(mergeStep => {
            const { left, right, parent } = mergeStep.data;
            
            // Find nodes to merge
            const leftIndex = nodes.findIndex(n => n.char === left.char && n.freq === left.freq);
            const rightIndex = nodes.findIndex(n => n.char === right.char && n.freq === right.freq);
            
            if (leftIndex !== -1 && rightIndex !== -1) {
                const leftNode = nodes[leftIndex];
                const rightNode = nodes[rightIndex];
                
                // Remove merged nodes
                nodes = nodes.filter((_, i) => i !== leftIndex && i !== rightIndex);
                
                // Add parent node
                const parentNode = {
                    char: null,
                    freq: parent.freq,
                    left: leftNode,
                    right: rightNode
                };
                
                nodes.push(parentNode);
            }
        });
        
        return nodes.length > 0 ? nodes[0] : null;
    };
    
    // Build tree from merge steps up to current step
    const buildTreeFromMergeSteps = () => {
        const step2 = steps.find(s => s.step === 2);
        if (!step2) return null;
        
        // Get merge steps up to current position
        const allMergeSteps = steps.filter(s => s.step === 3);
        const currentMergeIndex = currentStepIndex - 2; // Step 2 is at index 1
        const relevantMergeSteps = allMergeSteps.slice(0, Math.max(0, currentMergeIndex));
        
        let nodes = [...step2.data];
        
        // Apply relevant merge steps
        relevantMergeSteps.forEach(mergeStep => {
            const { left, right, parent } = mergeStep.data;
            
            const leftIndex = nodes.findIndex(n => n.char === left.char && n.freq === left.freq);
            const rightIndex = nodes.findIndex(n => n.char === right.char && n.freq === right.freq);
            
            if (leftIndex !== -1 && rightIndex !== -1) {
                const leftNode = nodes[leftIndex];
                const rightNode = nodes[rightIndex];
                
                nodes = nodes.filter((_, i) => i !== leftIndex && i !== rightIndex);
                
                const parentNode = {
                    char: null,
                    freq: parent.freq,
                    left: leftNode,
                    right: rightNode
                };
                
                nodes.push(parentNode);
            }
        });
        
        // Return the largest tree (by frequency) if multiple nodes exist
        return nodes.length > 0 ? nodes.reduce((max, node) => 
            node.freq > max.freq ? node : max
        ) : null;
    };

    // Get teaching explanation for current step
    const getTeachingExplanation = () => {
        switch (currentStep.step) {
            case 1:
                return {
                    title: "Step 1: Analyze Character Frequencies",
                    explanation: "First, we count how often each character appears in our text. This frequency analysis is crucial because Huffman coding assigns shorter codes to more frequent characters.",
                    keyPoint: "💡 More frequent characters = Shorter codes = Better compression!"
                };
            case 2:
                return {
                    title: "Step 2: Build Initial Tree Nodes",
                    explanation: "We create individual nodes for each character. These will be the leaf nodes of our final tree. Each node contains the character and its frequency.",
                    keyPoint: "🌱 These leaf nodes are the building blocks of our Huffman tree."
                };
            case 3:
                return {
                    title: "Step 3: Merge Nodes (Tree Construction)",
                    explanation: "We repeatedly find the two nodes with the lowest frequencies and merge them into a new parent node. The parent's frequency is the sum of its children.",
                    keyPoint: "🔄 This process continues until we have a single root node."
                };
            case 4:
                return {
                    title: "Step 4: Generate Binary Codes",
                    explanation: "We traverse the tree from root to each leaf. Going left adds '0', going right adds '1'. The path to each character becomes its binary code.",
                    keyPoint: "📝 Characters closer to the root get shorter codes!"
                };
            case 5:
                return {
                    title: "Step 5: Encode the Text",
                    explanation: "We replace each character in our original text with its corresponding Huffman code. This creates our compressed binary representation.",
                    keyPoint: "🎯 The magic happens - our text is now compressed!"
                };
            default:
                return {
                    title: "Huffman Coding Process",
                    explanation: "Follow along as we build the optimal compression tree.",
                    keyPoint: "📚 Each step builds upon the previous one."
                };
        }
    };

    const handlePlay = () => setIsPlaying(!isPlaying);
    const handleReset = () => {
        setCurrentStepIndex(0);
        setIsPlaying(false);
    };
    const handleNext = () => {
        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
        }
    };
    const handlePrevious = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(currentStepIndex - 1);
        }
    };

    const renderMainVisualization = () => {
        switch (currentStep.step) {
            case 1:
                return is3DMode ? 
                    <FrequencyChart3D data={currentStep.data} inputString={inputString} /> :
                    <FrequencyChart data={currentStep.data} inputString={inputString} />;
            case 3:
                return is3DMode ?
                    <MergeProcess3D data={currentStep.data} /> :
                    <MergeProcess data={currentStep.data} />;
            case 4:
                return <CodeTable codes={currentStep.data} />;
            case 5:
                return <EncodingResult data={currentStep.data} inputString={inputString} />;
            default:
                return (
                    <div className="flex items-center justify-center h-full p-8">
                        <div className="text-center">
                            <div className="text-6xl mb-4">🌳</div>
                            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                                Watch the Tree Grow!
                            </h3>
                            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                                The tree on the right shows the current state of our Huffman tree construction.
                            </p>
                        </div>
                    </div>
                );
        }
    };

    const teachingData = getTeachingExplanation();

    return (
        <div className="w-full">
            {/* Teaching Header */}
            <div className="mb-6 p-6 border rounded-lg" style={{ 
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border-default)'
            }}>
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                            {teachingData.title}
                        </h2>
                        <p className="text-base mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                            {teachingData.explanation}
                        </p>
                        <div className="px-4 py-2 rounded" style={{ 
                            backgroundColor: 'var(--color-primary-50)',
                            borderLeft: '4px solid var(--color-primary-500)'
                        }}>
                            <p className="text-sm font-medium" style={{ color: 'var(--color-primary-700)' }}>
                                {teachingData.keyPoint}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 ml-6">
                        {/* Progress indicator */}
                        <div className="text-center">
                            <div className="text-3xl font-bold" style={{ color: 'var(--color-primary-500)' }}>
                                {currentStepIndex + 1}
                            </div>
                            <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                                of {steps.length}
                            </div>
                        </div>
                        
                        {/* Mode toggles */}
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => setIs3DMode(!is3DMode)}
                                className="px-3 py-1 text-sm rounded border transition-all"
                                style={{
                                    backgroundColor: is3DMode ? 'var(--color-primary-500)' : 'var(--color-surface)',
                                    color: is3DMode ? 'white' : 'var(--color-text-primary)',
                                    borderColor: 'var(--color-border-default)'
                                }}
                            >
                                {is3DMode ? '🌟 3D' : '📊 2D'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--color-text-tertiary)' }}>
                        <span>Start</span>
                        <span>{Math.round(progress)}% Complete</span>
                        <span>Complete</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                            className="h-3 rounded-full transition-all duration-500"
                            style={{ 
                                width: `${progress}%`,
                                backgroundColor: 'var(--color-primary-500)'
                            }}
                        />
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handlePrevious}
                            disabled={currentStepIndex === 0}
                            className="px-4 py-2 rounded border transition-all flex items-center gap-2"
                            style={{
                                backgroundColor: currentStepIndex === 0 ? 'var(--color-neutral-100)' : 'var(--color-surface)',
                                borderColor: 'var(--color-border-default)',
                                color: currentStepIndex === 0 ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)',
                                cursor: currentStepIndex === 0 ? 'not-allowed' : 'pointer'
                            }}
                        >
                            ⏮ Previous
                        </button>
                        
                        <button
                            onClick={handlePlay}
                            disabled={currentStepIndex >= steps.length - 1}
                            className="px-6 py-2 rounded font-medium text-white transition-all flex items-center gap-2"
                            style={{
                                backgroundColor: currentStepIndex >= steps.length - 1 
                                    ? 'var(--color-neutral-400)' 
                                    : isPlaying ? 'var(--color-warning-500)' : 'var(--color-primary-500)',
                                cursor: currentStepIndex >= steps.length - 1 ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {isPlaying ? '⏸ Pause Lesson' : '▶ Continue Lesson'}
                        </button>
                        
                        <button
                            onClick={handleNext}
                            disabled={currentStepIndex >= steps.length - 1}
                            className="px-4 py-2 rounded border transition-all flex items-center gap-2"
                            style={{
                                backgroundColor: currentStepIndex >= steps.length - 1 ? 'var(--color-neutral-100)' : 'var(--color-surface)',
                                borderColor: 'var(--color-border-default)',
                                color: currentStepIndex >= steps.length - 1 ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)',
                                cursor: currentStepIndex >= steps.length - 1 ? 'not-allowed' : 'pointer'
                            }}
                        >
                            Next ⏭
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Speed:</span>
                        <select
                            value={playSpeed}
                            onChange={(e) => setPlaySpeed(Number(e.target.value))}
                            className="text-xs p-2 border rounded"
                            style={{ 
                                backgroundColor: 'var(--color-surface)',
                                borderColor: 'var(--color-border-default)',
                                color: 'var(--color-text-primary)'
                            }}
                        >
                            <option value={3000}>Slow (3s)</option>
                            <option value={2000}>Normal (2s)</option>
                            <option value={1000}>Fast (1s)</option>
                        </select>

                        <button
                            onClick={handleReset}
                            className="px-3 py-2 rounded border transition-all ml-2"
                            style={{
                                backgroundColor: 'var(--color-surface)',
                                borderColor: 'var(--color-border-default)',
                                color: 'var(--color-text-primary)'
                            }}
                        >
                            🔄 Restart Lesson
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area with Side-by-Side Layout */}
            <div className="grid grid-cols-12 gap-6">
                {/* Main Visualization Area */}
                <div className="col-span-7">
                    <div className="border rounded-lg p-6" style={{ 
                        backgroundColor: 'var(--color-surface)',
                        borderColor: 'var(--color-border-default)',
                        minHeight: is3DMode ? '600px' : '500px'
                    }}>
                        {renderMainVisualization()}
                    </div>
                </div>

                {/* Progressive Tree Sidebar */}
                <div className="col-span-5">
                    <div className="border rounded-lg p-4" style={{ 
                        backgroundColor: 'var(--color-surface)',
                        borderColor: 'var(--color-border-default)',
                        minHeight: is3DMode ? '600px' : '500px'
                    }}>
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
                                🌳 Progressive Tree
                            </h4>
                            <div className="text-xs px-2 py-1 rounded" style={{ 
                                backgroundColor: 'var(--color-secondary-100)',
                                color: 'var(--color-secondary-700)'
                            }}>
                                Live Updates
                            </div>
                        </div>
                        
                        {getProgressiveTreeData() ? (
                            is3DMode ? 
                                <ProgressiveTree3D 
                                    tree={getProgressiveTreeData()} 
                                    currentStep={currentStep.step}
                                    highlightNew={true}
                                /> :
                                <TreeVisualization 
                                    tree={getProgressiveTreeData()} 
                                />
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                    <div className="text-4xl mb-3">🌱</div>
                                    <h5 className="font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                                        Tree Building Phase
                                    </h5>
                                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                                        The tree will appear here as we start building it in the next steps.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Step Navigation Pills */}
            <div className="mt-6 flex justify-center gap-2">
                {steps.map((step, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentStepIndex(index)}
                        className="px-4 py-2 rounded-full text-sm transition-all flex items-center gap-2"
                        style={{
                            backgroundColor: index === currentStepIndex 
                                ? 'var(--color-primary-500)' 
                                : index < currentStepIndex 
                                    ? 'var(--color-success-100)'
                                    : 'var(--color-neutral-200)',
                            color: index === currentStepIndex 
                                ? 'white' 
                                : index < currentStepIndex 
                                    ? 'var(--color-success-700)'
                                    : 'var(--color-text-secondary)',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                        title={`Step ${step.step}: ${step.description}`}
                    >
                        {index < currentStepIndex && '✓'}
                        {index === currentStepIndex && '▶'}
                        Step {step.step}
                    </button>
                ))}
            </div>

            {/* Educational Summary */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded border" style={{ 
                    backgroundColor: 'var(--color-success-50)',
                    borderColor: 'var(--color-success-300)'
                }}>
                    <h5 className="font-medium mb-2" style={{ color: 'var(--color-success-700)' }}>
                        🎯 Learning Objectives
                    </h5>
                    <div className="space-y-1 text-sm" style={{ color: 'var(--color-success-600)' }}>
                        <p>• Understand frequency analysis</p>
                        <p>• Learn tree construction process</p>
                        <p>• See how codes are generated</p>
                        <p>• Experience compression in action</p>
                    </div>
                </div>

                <div className="p-4 rounded border" style={{ 
                    backgroundColor: 'var(--color-primary-50)',
                    borderColor: 'var(--color-primary-300)'
                }}>
                    <h5 className="font-medium mb-2" style={{ color: 'var(--color-primary-700)' }}>
                        🔧 Interactive Features
                    </h5>
                    <div className="space-y-1 text-sm" style={{ color: 'var(--color-primary-600)' }}>
                        <p>• Progressive tree visualization</p>
                        <p>• Step-by-step explanations</p>
                        <p>• 3D interactive exploration</p>
                        <p>• Real-time algorithm updates</p>
                    </div>
                </div>

                <div className="p-4 rounded border" style={{ 
                    backgroundColor: 'var(--color-warning-50)',
                    borderColor: 'var(--color-warning-300)'
                }}>
                    <h5 className="font-medium mb-2" style={{ color: 'var(--color-warning-700)' }}>
                        💡 Key Insights
                    </h5>
                    <div className="space-y-1 text-sm" style={{ color: 'var(--color-warning-600)' }}>
                        <p>• Frequency determines code length</p>
                        <p>• Tree structure enables decoding</p>
                        <p>• Greedy algorithm finds optimum</p>
                        <p>• Binary tree = prefix-free codes</p>
                    </div>
                </div>
            </div>
        </div>
    );
} 