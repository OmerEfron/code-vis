'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from './ui/Card';
import Button from './ui/Button';
import dynamic from 'next/dynamic';

// Dynamically import visualization components
const BubbleSortVisualization = dynamic(() => import('./visualizations/BubbleSortVisualization'), {
    loading: () => <div className="p-8 text-center">Loading visualization...</div>
});

const BinarySearchVisualization = dynamic(() => import('./visualizations/BinarySearchVisualization'), {
    loading: () => <div className="p-8 text-center">Loading visualization...</div>
});

const HuffmanVisualization = dynamic(() => import('./huffman/HuffmanVisualization'), {
    loading: () => <div className="p-8 text-center">Loading visualization...</div>
});

// Fibonacci visualization (new)
const FibonacciVisualization = dynamic(() => import('./visualizations/FibonacciVisualization'), {
    loading: () => <div className="p-8 text-center">Loading visualization...</div>
});

export default function Examples() {
    const [selectedExample, setSelectedExample] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');

    const preAnalyzedExamples = [
        {
            id: 'binary-search',
            title: 'Binary Search',
            category: 'Searching',
            difficulty: 'Medium',
            description: 'Efficiently finds an element in a sorted array by repeatedly dividing the search space in half.',
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
}`,
            analysis: {
                algorithmType: 'Binary Search',
                category: 'Searching Algorithm',
                timeComplexity: 'O(log n)',
                spaceComplexity: 'O(1)',
                explanation: 'Binary search works by comparing the target with the middle element and eliminating half of the search space in each iteration.',
                metaphor: 'Like finding a word in a dictionary - you open to the middle, see if your word comes before or after, then repeat with the appropriate half.',
                bestUseCase: 'Searching in large sorted datasets',
                worstCase: 'Target not found or at the extremes'
            },
            visualizationProps: {
                array: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19],
                target: 7,
                speed: 800
            },
            tags: ['divide-and-conquer', 'sorted-array', 'efficient']
        },
        {
            id: 'bubble-sort',
            title: 'Bubble Sort',
            category: 'Sorting',
            difficulty: 'Easy',
            description: 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
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
}`,
            analysis: {
                algorithmType: 'Bubble Sort',
                category: 'Sorting Algorithm',
                timeComplexity: 'O(n²)',
                spaceComplexity: 'O(1)',
                explanation: 'Bubble sort compares adjacent elements and swaps them if they are in wrong order. The largest element "bubbles up" to its correct position in each pass.',
                metaphor: 'Like bubbles rising to the surface - larger elements gradually move to the end through repeated swaps.',
                bestUseCase: 'Educational purposes and small datasets',
                worstCase: 'Large datasets due to quadratic time complexity'
            },
            visualizationProps: {
                array: [64, 34, 25, 12, 22, 11, 90],
                speed: 500
            },
            tags: ['comparison-sort', 'in-place', 'stable']
        },
        {
            id: 'huffman-encoding',
            title: 'Huffman Encoding',
            category: 'Compression',
            difficulty: 'Hard',
            description: 'A lossless data compression algorithm that assigns variable-length codes to characters based on their frequencies.',
            code: `function huffmanEncode(text) {
    // Count character frequencies
    const freq = {};
    for (const char of text) {
        freq[char] = (freq[char] || 0) + 1;
    }
    
    // Create leaf nodes
    const nodes = Object.entries(freq).map(([char, frequency]) => ({
        char, freq: frequency, left: null, right: null
    }));
    
    // Build Huffman tree
    while (nodes.length > 1) {
        nodes.sort((a, b) => a.freq - b.freq);
        const left = nodes.shift();
        const right = nodes.shift();
        
        nodes.push({
            char: null,
            freq: left.freq + right.freq,
            left, right
        });
    }
    
    const tree = nodes[0];
    
    // Generate codes
    const codes = {};
    const generateCodes = (node, code = '') => {
        if (node.char !== null) {
            codes[node.char] = code || '0';
        } else {
            if (node.left) generateCodes(node.left, code + '0');
            if (node.right) generateCodes(node.right, code + '1');
        }
    };
    
    generateCodes(tree);
    
    // Encode text
    return text.split('').map(char => codes[char]).join('');
}`,
            analysis: {
                algorithmType: 'Huffman Encoding',
                category: 'Compression Algorithm',
                timeComplexity: 'O(n log n)',
                spaceComplexity: 'O(n)',
                explanation: 'Huffman encoding creates an optimal binary tree where frequently used characters get shorter codes, achieving efficient compression.',
                metaphor: 'Like creating a personalized shorthand where common words get shorter abbreviations.',
                bestUseCase: 'Text and data compression where character frequencies vary significantly',
                worstCase: 'Uniform character distribution reduces compression efficiency'
            },
            visualizationProps: {
                input: 'hello world'
            },
            tags: ['greedy', 'compression', 'binary-tree']
        },
        {
            id: 'fibonacci',
            title: 'Fibonacci Sequence',
            category: 'Mathematical',
            difficulty: 'Easy',
            description: 'Computes the nth Fibonacci number using dynamic programming approach.',
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
}`,
            analysis: {
                algorithmType: 'Fibonacci (Iterative)',
                category: 'Dynamic Programming',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(1)',
                explanation: 'This iterative approach calculates Fibonacci numbers efficiently by storing only the last two values.',
                metaphor: 'Like climbing stairs where each step depends on the previous two steps.',
                bestUseCase: 'Computing Fibonacci numbers efficiently',
                worstCase: 'Very large values of n may cause integer overflow'
            },
            visualizationProps: {
                n: 10,
                speed: 500
            },
            tags: ['dynamic-programming', 'iterative', 'mathematical']
        },
        {
            id: 'quick-sort',
            title: 'Quick Sort',
            category: 'Sorting',
            difficulty: 'Hard',
            description: 'A divide-and-conquer sorting algorithm that picks a pivot and partitions the array around it.',
            code: `function quickSort(arr, low = 0, high = arr.length - 1) {
    if (low < high) {
        const pi = partition(arr, low, high);
        
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
    
    return arr;
}

function partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
}`,
            analysis: {
                algorithmType: 'Quick Sort',
                category: 'Sorting Algorithm',
                timeComplexity: 'O(n log n) average, O(n²) worst',
                spaceComplexity: 'O(log n)',
                explanation: 'Quick sort picks a pivot element and partitions the array so that smaller elements go to the left and larger elements go to the right.',
                metaphor: 'Like organizing a library by picking a book as reference and placing all books before it on the left shelf and all books after it on the right shelf.',
                bestUseCase: 'General-purpose sorting with good average performance',
                worstCase: 'Already sorted arrays with poor pivot selection'
            },
            tags: ['divide-and-conquer', 'in-place', 'comparison-sort']
        }
    ];

    const categories = ['all', 'Sorting', 'Searching', 'Compression', 'Mathematical'];
    const difficulties = ['Easy', 'Medium', 'Hard'];

    const filteredExamples = preAnalyzedExamples.filter(example => {
        const matchesSearch = example.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            example.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            example.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesCategory = filterCategory === 'all' || example.category === filterCategory;
        
        return matchesSearch && matchesCategory;
    });

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Easy': return 'var(--color-success-500)';
            case 'Medium': return 'var(--color-warning-500)';
            case 'Hard': return 'var(--color-danger-500)';
            default: return 'var(--color-neutral-500)';
        }
    };

    const renderVisualization = (example) => {
        switch (example.id) {
            case 'binary-search':
                return <BinarySearchVisualization {...example.visualizationProps} />;
            case 'bubble-sort':
                return <BubbleSortVisualization {...example.visualizationProps} />;
            case 'huffman-encoding':
                return <HuffmanVisualization {...example.visualizationProps} />;
            case 'fibonacci':
                return <FibonacciVisualization {...example.visualizationProps} />;
            default:
                return (
                    <div className="p-8 rounded-lg border border-dashed" style={{ borderColor: 'var(--color-border-default)' }}>
                        <div className="text-center">
                            <div className="text-4xl mb-4">🚧</div>
                            <h5 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                                Visualization Coming Soon
                            </h5>
                            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                                Interactive visualization for {example.title} is in development.
                            </p>
                        </div>
                    </div>
                );
        }
    };

    if (selectedExample) {
        return (
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
            >
                {/* Back Button */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        onClick={() => setSelectedExample(null)}
                        className="flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Examples
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                            {selectedExample.title}
                        </h2>
                        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                            {selectedExample.description}
                        </p>
                    </div>
                </div>

                {/* Interactive Visualization */}
                <Card>
                    <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                        🎮 Interactive Visualization
                    </h3>
                    {renderVisualization(selectedExample)}
                </Card>

                {/* Algorithm Analysis */}
                <Card>
                    <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                        📊 Algorithm Analysis
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <h4 className="font-semibold mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                                Complexity:
                            </h4>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm">Time:</span>
                                    <code className="px-2 py-1 rounded text-sm" style={{ backgroundColor: 'var(--color-primary-100)', color: 'var(--color-primary-700)' }}>
                                        {selectedExample.analysis.timeComplexity}
                                    </code>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm">Space:</span>
                                    <code className="px-2 py-1 rounded text-sm" style={{ backgroundColor: 'var(--color-secondary-100)', color: 'var(--color-secondary-700)' }}>
                                        {selectedExample.analysis.spaceComplexity}
                                    </code>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <h4 className="font-semibold mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                                Category:
                            </h4>
                            <span className="px-3 py-1 rounded-full text-sm font-medium" 
                                  style={{ backgroundColor: 'var(--color-accent-100)', color: 'var(--color-accent-700)' }}>
                                {selectedExample.analysis.category}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                                How it Works:
                            </h4>
                            <p className="text-sm" style={{ color: 'var(--color-text-primary)' }}>
                                {selectedExample.analysis.explanation}
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                                Real-World Metaphor:
                            </h4>
                            <p className="text-sm italic" style={{ color: 'var(--color-text-primary)' }}>
                                {selectedExample.analysis.metaphor}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-semibold mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                                    Best Use Case:
                                </h4>
                                <p className="text-sm" style={{ color: 'var(--color-success-600)' }}>
                                    {selectedExample.analysis.bestUseCase}
                                </p>
                            </div>
                            
                            <div>
                                <h4 className="font-semibold mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                                    Limitations:
                                </h4>
                                <p className="text-sm" style={{ color: 'var(--color-warning-600)' }}>
                                    {selectedExample.analysis.worstCase}
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Source Code */}
                <Card>
                    <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                        💻 Source Code
                    </h3>
                    <pre className="p-4 rounded-lg overflow-x-auto text-sm" 
                         style={{ 
                             backgroundColor: 'var(--color-neutral-50)', 
                             color: 'var(--color-text-primary)',
                             fontFamily: 'var(--font-mono)'
                         }}>
                        <code>{selectedExample.code}</code>
                    </pre>
                </Card>

                {/* Tags */}
                <Card>
                    <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                        🏷️ Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {selectedExample.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 rounded-full text-sm"
                                style={{ 
                                    backgroundColor: 'var(--color-neutral-100)', 
                                    color: 'var(--color-neutral-700)' 
                                }}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </Card>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="text-center">
                <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                    📚 Algorithm Examples
                </h2>
                <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
                    Explore pre-analyzed algorithms with interactive visualizations
                </p>
            </div>

            {/* Search and Filters */}
            <Card>
                <div className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search algorithms, descriptions, or tags..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                                style={{
                                    backgroundColor: 'var(--color-surface)',
                                    borderColor: 'var(--color-border-default)',
                                    color: 'var(--color-text-primary)'
                                }}
                            />
                        </div>
                        
                        <div className="flex gap-2">
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                                style={{
                                    backgroundColor: 'var(--color-surface)',
                                    borderColor: 'var(--color-border-default)',
                                    color: 'var(--color-text-primary)'
                                }}
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {category === 'all' ? 'All Categories' : category}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        <span>
                            {filteredExamples.length} example{filteredExamples.length !== 1 ? 's' : ''} found
                        </span>
                        <div className="flex items-center gap-4">
                            {difficulties.map(difficulty => (
                                <div key={difficulty} className="flex items-center gap-2">
                                    <div 
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: getDifficultyColor(difficulty) }}
                                    ></div>
                                    <span>{difficulty}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Card>

            {/* Examples Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {filteredExamples.map((example, index) => (
                        <motion.div
                            key={example.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            <Card className="h-full cursor-pointer transition-all duration-200 hover:shadow-lg">
                                <div 
                                    className="h-full flex flex-col"
                                    onClick={() => setSelectedExample(example)}
                                >
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold" style={{ color: 'var(--color-text-primary)' }}>
                                                {example.title}
                                            </h3>
                                            <span 
                                                className="px-2 py-1 rounded text-xs font-medium"
                                                style={{ 
                                                    backgroundColor: getDifficultyColor(example.difficulty) + '20',
                                                    color: getDifficultyColor(example.difficulty)
                                                }}
                                            >
                                                {example.difficulty}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-sm mb-4 flex-1" style={{ color: 'var(--color-text-secondary)' }}>
                                        {example.description}
                                    </p>

                                    {/* Analysis Preview */}
                                    <div className="space-y-3 mb-4">
                                        <div className="flex justify-between text-sm">
                                            <span style={{ color: 'var(--color-text-secondary)' }}>Time:</span>
                                            <code className="text-xs px-2 py-1 rounded" 
                                                  style={{ backgroundColor: 'var(--color-primary-100)', color: 'var(--color-primary-700)' }}>
                                                {example.analysis.timeComplexity}
                                            </code>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span style={{ color: 'var(--color-text-secondary)' }}>Space:</span>
                                            <code className="text-xs px-2 py-1 rounded" 
                                                  style={{ backgroundColor: 'var(--color-secondary-100)', color: 'var(--color-secondary-700)' }}>
                                                {example.analysis.spaceComplexity}
                                            </code>
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-1 mb-4">
                                        {example.tags.slice(0, 3).map((tag, tagIndex) => (
                                            <span
                                                key={tagIndex}
                                                className="px-2 py-1 rounded text-xs"
                                                style={{ 
                                                    backgroundColor: 'var(--color-neutral-100)', 
                                                    color: 'var(--color-neutral-600)' 
                                                }}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                        {example.tags.length > 3 && (
                                            <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                                                +{example.tags.length - 3} more
                                            </span>
                                        )}
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-3 border-t" 
                                         style={{ borderColor: 'var(--color-border-default)' }}>
                                        <span className="text-sm font-medium" 
                                              style={{ color: 'var(--color-text-secondary)' }}>
                                            {example.category}
                                        </span>
                                        <Button variant="outline" size="sm">
                                            Explore →
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Empty State */}
            {filteredExamples.length === 0 && (
                <Card>
                    <div className="text-center py-8">
                        <div className="text-4xl mb-4">🔍</div>
                        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                            No examples found
                        </h3>
                        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                            Try adjusting your search terms or filters
                        </p>
                    </div>
                </Card>
            )}
        </motion.div>
    );
} 