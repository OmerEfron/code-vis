const CParser = require('../parsers/cParser');
const { Algorithm, MergeSortAlgorithm } = require('../models/Algorithm');

// Enhanced Response formatter with user-friendly messages
const ResponseFormatter = {
    success: (data, meta = {}) => ({
        success: true,
        data,
        meta: {
            timestamp: new Date().toISOString(),
            message: 'Visualization generated successfully! Ready to explore your algorithm step by step.',
            ...meta
        }
    }),
    error: (message, details = null, suggestions = []) => ({
        success: false,
        error: message,
        details,
        suggestions,
        meta: {
            timestamp: new Date().toISOString()
        }
    })
};

// Enhanced visualization prompts and descriptions
const VisualizationPrompts = {
    getWelcomeMessage: (algorithmType) => {
        const messages = {
            mergesort: "🎯 Let's visualize Merge Sort! Watch how it systematically divides and conquers to sort your data.",
            bubblesort: "🫧 Bubble Sort in action! See how elements 'bubble up' to their correct positions.",
            quicksort: "⚡ Quick Sort visualization! Experience the power of efficient partitioning.",
            linearsearch: "🔍 Linear Search step-by-step! Follow the systematic search through each element.",
            binarysearch: "📚 Binary Search magic! Watch how we eliminate half the possibilities with each step."
        };
        return messages[algorithmType.toLowerCase()] || `✨ Algorithm visualization ready! Let's explore ${algorithmType} together.`;
    },

    getStepDescription: (algorithmType, stepType, context = {}) => {
        const descriptions = {
            mergesort: {
                initialization: "🚀 Starting Merge Sort - We'll divide the array into smaller pieces and then merge them back in order.",
                dividing: `📦 Dividing: Breaking down the array into halves. Current focus: elements ${context.range || 'unknown range'}.`,
                comparing: `⚖️ Comparing: Looking at elements ${context.left || '?'} and ${context.right || '?'} to determine order.`,
                merging: `🔧 Merging: Combining sorted pieces back together. Progress: ${context.progress || 0}% complete.`,
                completion: "🎉 Complete! All elements are now perfectly sorted. Great job following along!"
            },
            binarysearch: {
                initialization: "🎯 Binary Search begins! We'll find your target by cutting the search space in half each time.",
                comparing: `🔍 Checking middle element: ${context.current || '?'}. Target: ${context.target || '?'}.`,
                eliminating: `✂️ Eliminating half: ${context.eliminated || '?'} elements no longer need checking.`,
                narrowing: `🎯 Narrowing search: Now focusing on ${context.remaining || '?'} elements.`,
                found: `🎉 Found it! Target ${context.target || '?'} located at position ${context.position || '?'}.`,
                notFound: "🤔 Target not found in the array. The search has checked all possibilities."
            }
        };

        const algoDescriptions = descriptions[algorithmType.toLowerCase()];
        return algoDescriptions?.[stepType] || `Step: ${stepType} - ${context.description || 'Processing algorithm step'}`;
    },

    getComplexityExplanation: (timeComplexity, spaceComplexity) => {
        const explanations = {
            'O(1)': 'Excellent! Constant time - lightning fast ⚡',
            'O(log n)': 'Great! Logarithmic time - very efficient 🚀',
            'O(n)': 'Good! Linear time - scales well 📈',
            'O(n log n)': 'Solid! Linearithmic time - optimal for comparison sorts 👍',
            'O(n²)': 'Okay! Quadratic time - fine for small datasets ⚠️',
            'O(2^n)': 'Slow! Exponential time - avoid for large datasets 🐌'
        };

        return {
            time: {
                complexity: timeComplexity,
                description: explanations[timeComplexity] || 'Processing complexity',
                performance: getPerformanceLevel(timeComplexity)
            },
            space: {
                complexity: spaceComplexity,
                description: explanations[spaceComplexity] || 'Memory usage complexity',
                performance: getPerformanceLevel(spaceComplexity)
            }
        };
    }
};

const getPerformanceLevel = (complexity) => {
    if (complexity.includes('1)') || complexity.includes('log')) return 'excellent';
    if (complexity.includes('n)') && !complexity.includes('²')) return 'good';
    if (complexity.includes('n²')) return 'average';
    return 'poor';
};

// Factory to create the appropriate algorithm instance
const createAlgorithm = (type, code, data = null) => {
    switch (type.toLowerCase()) {
        case 'mergesort':
            const algorithm = new MergeSortAlgorithm('mergeSort', code);
            if (data && Array.isArray(data)) {
                // Override the parsed data if explicitly provided
                algorithm.data = data;
            }
            return algorithm;
        case 'bubblesort':
            // Future implementation
            throw new Error('Bubble Sort visualization not yet implemented');
        case 'quicksort':
            // Future implementation
            throw new Error('Quick Sort visualization not yet implemented');
        case 'linearsearch':
            // Future implementation
            throw new Error('Linear Search visualization not yet implemented');
        case 'binarysearch':
            // Future implementation
            throw new Error('Binary Search visualization not yet implemented');
        default:
            throw new Error(`Unsupported algorithm type: ${type}. Supported types: mergeSort`);
    }
};

const generateVisualization = async (req, res) => {
    try {
        const { code, scenario = 'sorting', data = null } = req.body;

        // Enhanced input validation with helpful suggestions
        if (!code || typeof code !== 'string') {
            return res.status(400).json(
                ResponseFormatter.error(
                    'Oops! We need your algorithm code to create a visualization.',
                    { field: 'code', type: 'missing_required' },
                    [
                        'Make sure to include your algorithm code in the request',
                        'Code should be a valid string',
                        'Try pasting a simple sorting algorithm like Merge Sort'
                    ]
                )
            );
        }

        if (code.trim().length === 0) {
            return res.status(400).json(
                ResponseFormatter.error(
                    'Your code appears to be empty. Please provide some algorithm code to visualize!',
                    { field: 'code', type: 'empty_input' },
                    [
                        'Paste or type your algorithm code',
                        'Even a simple sorting function will work',
                        'Check our examples for inspiration'
                    ]
                )
            );
        }

        if (code.length > 10000) {
            return res.status(400).json(
                ResponseFormatter.error(
                    'Whoa! That\'s a lot of code. Please keep it under 10,000 characters for the best visualization experience.',
                    { field: 'code', type: 'too_long', maxLength: 10000 },
                    [
                        'Focus on the core algorithm logic',
                        'Remove unnecessary comments or debugging code',
                        'Break complex algorithms into smaller functions'
                    ]
                )
            );
        }

        // Parse the code to detect algorithm type and structure
        const parser = new CParser();
        const parseResult = parser.parse(code);

        if (parseResult.type === 'unknown') {
            return res.status(400).json(
                ResponseFormatter.error(
                    'Hmm, we couldn\'t identify the algorithm type from your code. Let\'s try a supported algorithm!',
                    { 
                        supportedTypes: ['mergeSort'],
                        detectedPatterns: parseResult.detectedPatterns || [],
                        codeLength: code.length
                    },
                    [
                        'Try implementing Merge Sort - it\'s well supported!',
                        'Make sure your function names are descriptive (e.g., mergeSort, merge)',
                        'Include the main algorithm logic, not just helper functions',
                        'Check our examples for properly formatted algorithms'
                    ]
                )
            );
        }

        // Create appropriate algorithm instance
        const algorithm = createAlgorithm(parseResult.type, code, data);
        
        // Initialize algorithm with parsed data
        algorithm.initialize();

        // Generate all visualization states with enhanced descriptions
        const states = algorithm.getAllStates(scenario);

        // Get complexity explanations
        const complexityInfo = VisualizationPrompts.getComplexityExplanation(
            'O(n log n)', // This should come from the algorithm
            'O(n)'       // This should come from the algorithm
        );

        // Enhanced visualization response with user-friendly content
        const visualizationData = {
            welcome: {
                message: VisualizationPrompts.getWelcomeMessage(parseResult.type),
                algorithmName: parseResult.type.charAt(0).toUpperCase() + parseResult.type.slice(1),
                description: getAlgorithmDescription(parseResult.type),
                difficulty: getAlgorithmDifficulty(parseResult.type)
            },
            algorithm: {
                type: parseResult.type,
                structure: parseResult.structure,
                initialData: parseResult.data || generateSampleData(parseResult.type),
                complexity: complexityInfo
            },
            scenario: {
                name: scenario,
                description: getScenarioDescription(scenario),
                tips: getScenarioTips(scenario)
            },
            visualization: {
                states: states.map((state, index) => ({
                    stepNumber: index + 1,
                    title: state.title || `Step ${index + 1}`,
                    description: state.description || VisualizationPrompts.getStepDescription(
                        parseResult.type, 
                        getStepType(index, states.length),
                        state.context || {}
                    ),
                    explanation: state.explanation || `Processing step ${index + 1} of the ${parseResult.type} algorithm.`,
                    visualElements: {
                        ...state,
                        animations: state.animations || [],
                        highlights: state.highlights || [],
                        focus: state.focus || null
                    },
                    interaction: {
                        canSkip: true,
                        canReplay: true,
                        speed: state.recommendedSpeed || 'normal'
                    },
                    canvasLayout: {
                        width: 900,
                        height: 500,
                        scale: 1,
                        origin: { x: 450, y: 250 },
                        padding: { top: 50, right: 50, bottom: 100, left: 50 }
                    }
                })),
                metadata: {
                    totalSteps: states.length,
                    estimatedDuration: `${Math.ceil(states.length * 3 / 60)} minutes`,
                    difficulty: getAlgorithmDifficulty(parseResult.type),
                    learningObjectives: getLearningObjectives(parseResult.type),
                    complexity: complexityInfo
                }
            },
            controls: {
                playback: {
                    speeds: [0.5, 1, 1.5, 2, 3],
                    defaultSpeed: 1,
                    autoPlay: false
                },
                navigation: {
                    allowJump: true,
                    showProgress: true,
                    showStepNumbers: true
                },
                display: {
                    showCode: true,
                    showComplexity: true,
                    showComparisons: true,
                    showStepDescription: true
                }
            }
        };

        return res.json(
            ResponseFormatter.success(visualizationData, {
                algorithmType: parseResult.type,
                totalSteps: states.length,
                estimatedDuration: visualizationData.visualization.metadata.estimatedDuration,
                difficulty: visualizationData.welcome.difficulty
            })
        );

    } catch (error) {
        console.error('Visualization generation error:', error);
        
        if (error.message.includes('not yet implemented')) {
            return res.status(501).json(
                ResponseFormatter.error(
                    `${error.message} - We're working on adding more algorithms soon!`,
                    { type: 'not_implemented', algorithm: 'unknown' },
                    [
                        'Try Merge Sort instead - it\'s fully supported!',
                        'Check back soon for more algorithm support',
                        'Explore our example visualizations in the meantime'
                    ]
                )
            );
        }

        return res.status(500).json(
            ResponseFormatter.error(
                'Something went wrong while creating your visualization. Don\'t worry, we\'re on it!',
                process.env.NODE_ENV === 'development' ? { error: error.message, stack: error.stack } : undefined,
                [
                    'Try refreshing the page and trying again',
                    'Check if your code has any syntax errors',
                    'Contact support if the problem persists'
                ]
            )
        );
    }
};

// Helper functions for enhanced visualization content
const getAlgorithmDescription = (type) => {
    const descriptions = {
        mergesort: 'A divide-and-conquer sorting algorithm that splits arrays in half, sorts each half, then merges them back together.',
        bubblesort: 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they\'re in the wrong order.',
        quicksort: 'An efficient divide-and-conquer sorting algorithm that picks a pivot element and partitions the array around it.',
        linearsearch: 'A straightforward searching algorithm that checks every element in the list until it finds the target value.',
        binarysearch: 'An efficient searching algorithm that works on sorted arrays by repeatedly dividing the search interval in half.'
    };
    return descriptions[type.toLowerCase()] || 'A fundamental computer science algorithm for data processing.';
};

const getAlgorithmDifficulty = (type) => {
    const difficulties = {
        mergesort: 'intermediate',
        bubblesort: 'beginner',
        quicksort: 'advanced',
        linearsearch: 'beginner',
        binarysearch: 'intermediate'
    };
    return difficulties[type.toLowerCase()] || 'intermediate';
};

const getScenarioDescription = (scenario) => {
    const descriptions = {
        sorting: 'Watch how elements get arranged in ascending order through systematic comparisons and swaps.',
        searching: 'Follow the algorithm as it intelligently searches for a target value in the data structure.',
        traversal: 'Observe how the algorithm visits and processes each element in the data structure.'
    };
    return descriptions[scenario] || 'Explore how this algorithm processes and manipulates data step by step.';
};

const getScenarioTips = (scenario) => {
    const tips = {
        sorting: [
            'Watch how smaller subarrays get merged into larger sorted arrays',
            'Notice the divide-and-conquer approach in action',
            'Pay attention to how comparisons determine element placement'
        ],
        searching: [
            'Observe how the search space gets reduced with each step',
            'Notice the efficiency compared to checking every element',
            'Watch how the algorithm eliminates impossible locations'
        ],
        traversal: [
            'Follow the systematic path through the data structure',
            'Notice how each element gets visited exactly once',
            'Observe the order in which elements are processed'
        ]
    };
    return tips[scenario] || ['Follow along step by step', 'Pay attention to the algorithm logic', 'Notice the efficiency patterns'];
};

const getLearningObjectives = (type) => {
    const objectives = {
        mergesort: [
            'Understand the divide-and-conquer approach',
            'Learn how merging sorted arrays works',
            'Appreciate the O(n log n) time complexity',
            'See why merge sort is stable and predictable'
        ],
        binarysearch: [
            'Understand logarithmic time complexity',
            'Learn the importance of sorted data',
            'See how elimination reduces search space',
            'Appreciate the efficiency of divide-and-conquer'
        ]
    };
    return objectives[type.toLowerCase()] || ['Understand algorithm logic', 'Learn time complexity', 'See practical applications'];
};

const getStepType = (stepIndex, totalSteps) => {
    if (stepIndex === 0) return 'initialization';
    if (stepIndex === totalSteps - 1) return 'completion';
    if (stepIndex < totalSteps * 0.3) return 'dividing';
    if (stepIndex < totalSteps * 0.8) return 'comparing';
    return 'merging';
};

const generateSampleData = (algorithmType) => {
    const samples = {
        mergesort: [64, 34, 25, 12, 22, 11, 90, 5],
        bubblesort: [64, 34, 25, 12, 22, 11, 90],
        quicksort: [10, 7, 8, 9, 1, 5],
        linearsearch: [2, 3, 4, 10, 40],
        binarysearch: [2, 3, 4, 10, 40, 50, 60, 70]
    };
    return samples[algorithmType.toLowerCase()] || [5, 2, 8, 1, 9, 3];
};

module.exports = {
    generateVisualization
}; 