const LLMFactory = require('../factory');

class CodeAnalyzer {
    constructor(providerType, config) {
        this.provider = LLMFactory.createProvider(providerType, config);
    }

    async initialize() {
        await this.provider.initialize();
    }

    async analyzeCode(code) {
        try {
            // Run all analyses in parallel for efficiency
            const [algorithmInfo, inputInfo, metaphors] = await Promise.all([
                this.provider.detectAlgorithm(code),
                this.provider.extractInputs(code),
                this.provider.generateMetaphors(code)
            ]);

            return {
                success: true,
                analysis: {
                    algorithm: algorithmInfo,
                    inputs: inputInfo,
                    metaphors: metaphors.metaphors
                }
            };
        } catch (error) {
            console.error('Code analysis error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Additional helper methods can be added here
    async suggestVisualization(analysisResult) {
        // This method can be implemented to suggest visualization parameters
        // based on the analysis results
        return {
            type: analysisResult.algorithm.algorithmType,
            recommended: {
                visualElements: this._mapAlgorithmToVisualElements(analysisResult),
                layout: this._suggestLayout(analysisResult),
                animations: this._suggestAnimations(analysisResult)
            }
        };
    }

    _mapAlgorithmToVisualElements(analysis) {
        const { algorithmType, category } = analysis.algorithm;
        
        // Default visual elements
        const elements = {
            primary: [],
            secondary: [],
            controls: ['play', 'pause', 'step', 'speed', 'reset'],
            metrics: {
                basic: ['comparisons', 'swaps', 'memory-usage'],
                advanced: ['time-complexity', 'space-complexity', 'current-phase']
            },
            indicators: {
                status: ['current-state', 'next-action', 'completion'],
                progress: ['step-count', 'phase-progress', 'total-progress']
            }
        };

        // Customize based on algorithm type
        switch (algorithmType.toLowerCase()) {
            case 'huffman coding':
                elements.primary = [
                    {
                        type: 'frequency-table',
                        features: ['sortable', 'highlighted-min', 'frequency-bars']
                    },
                    {
                        type: 'min-heap',
                        features: ['draggable-nodes', 'heap-property-highlight', 'frequency-labels']
                    },
                    {
                        type: 'huffman-tree',
                        features: ['expandable-nodes', 'path-tracing', 'code-generation']
                    },
                    {
                        type: 'code-table',
                        features: ['binary-visualization', 'length-indicator', 'efficiency-metric']
                    }
                ];
                elements.secondary = [
                    {
                        type: 'character-list',
                        features: ['frequency-sorting', 'usage-stats', 'search-filter']
                    },
                    {
                        type: 'frequency-distribution',
                        features: ['histogram', 'pie-chart', 'cumulative-graph']
                    },
                    {
                        type: 'tree-connections',
                        features: ['weighted-edges', 'direction-arrows', 'frequency-sums']
                    },
                    {
                        type: 'code-paths',
                        features: ['path-highlighting', 'bit-animation', 'compression-ratio']
                    }
                ];
                elements.overlays = [
                    {
                        type: 'step-explanation',
                        features: ['current-action', 'next-step-preview', 'decision-point']
                    },
                    {
                        type: 'statistics',
                        features: ['compression-ratio', 'tree-balance', 'code-efficiency']
                    }
                ];
                elements.controls.push(
                    {
                        type: 'view-controls',
                        options: ['show-frequencies', 'show-codes', 'tree-layout']
                    },
                    {
                        type: 'interaction-controls',
                        options: ['drag-nodes', 'trace-path', 'compare-codes']
                    }
                );
                break;
            case 'sorting':
                elements.primary = ['array', 'comparisons', 'swaps'];
                elements.secondary = ['pivots', 'partitions', 'merge-zones'];
                elements.controls.push('compare-mode', 'array-size');
                break;
            case 'searching':
                elements.primary = ['array', 'current', 'target'];
                elements.secondary = ['range', 'midpoint', 'search-history'];
                elements.controls.push('search-value', 'array-type');
                break;
            case 'graph':
                elements.primary = ['nodes', 'edges', 'current-path'];
                elements.secondary = ['visited', 'queue', 'stack'];
                elements.controls.push('graph-layout', 'path-highlight');
                break;
            default:
                elements.primary = ['algorithm-state', 'current-step'];
                elements.secondary = ['metrics', 'progress'];
        }

        return elements;
    }

    _suggestLayout(analysis) {
        const { algorithmType } = analysis.algorithm;
        
        // Base layout configuration
        const layout = {
            orientation: 'vertical',
            spacing: 30,
            dimensions: {
                width: 1000,
                height: 600,
                padding: 20,
                gutter: 10
            },
            grid: {
                columns: 12,
                rows: 8,
                gap: 15
            },
            sections: {
                main: { height: '70%' },
                controls: { height: '10%' },
                metrics: { height: '20%' }
            },
            responsive: {
                breakpoints: {
                    small: 768,
                    medium: 1024,
                    large: 1440
                },
                layouts: {
                    small: { orientation: 'vertical' },
                    medium: { orientation: 'horizontal' },
                    large: { orientation: 'horizontal' }
                }
            }
        };

        // Customize based on algorithm type
        switch (algorithmType.toLowerCase()) {
            case 'huffman coding':
                layout.sections = {
                    tree: {
                        height: '60%',
                        grid: { rowSpan: 5, colSpan: 8 }
                    },
                    heap: {
                        height: '20%',
                        grid: { rowSpan: 2, colSpan: 4 }
                    },
                    frequencies: {
                        height: '20%',
                        grid: { rowSpan: 1, colSpan: 12 }
                    },
                    controls: {
                        height: '10%',
                        grid: { rowSpan: 1, colSpan: 12 }
                    }
                };
                layout.components = {
                    tree: {
                        position: 'center',
                        scale: 'fit-width',
                        padding: { top: 20, right: 30, bottom: 20, left: 30 }
                    },
                    heap: {
                        position: 'left',
                        scale: 'fit-height',
                        padding: { top: 10, right: 20, bottom: 10, left: 20 }
                    },
                    frequencies: {
                        position: 'bottom',
                        scale: 'fit-width',
                        padding: { top: 10, right: 20, bottom: 10, left: 20 }
                    }
                };
                break;
            case 'sorting':
                layout.orientation = 'horizontal';
                layout.sections = {
                    array: { height: '60%' },
                    metrics: { height: '20%' },
                    controls: { height: '20%' }
                };
                break;
            // Add more cases as needed
        }

        return layout;
    }

    _suggestAnimations(analysis) {
        const { algorithmType } = analysis.algorithm;
        
        // Base animation configuration
        const animations = {
            duration: 500,
            easing: 'easeInOutQuad',
            highlights: true,
            transitions: {},
            effects: {
                highlight: {
                    color: '#FFD700',
                    duration: 300,
                    fadeOut: true
                },
                emphasis: {
                    scale: 1.1,
                    duration: 200,
                    elastic: true
                }
            },
            timing: {
                staggered: 50,
                pause: 300,
                completion: 500
            }
        };

        // Customize based on algorithm type
        switch (algorithmType.toLowerCase()) {
            case 'huffman coding':
                animations.transitions = {
                    nodeCreation: {
                        duration: 300,
                        easing: 'easeOutBounce',
                        effects: ['scale-in', 'fade-in'],
                        highlights: {
                            color: '#4CAF50',
                            duration: 200
                        }
                    },
                    treeConnection: {
                        duration: 400,
                        easing: 'easeInOutQuad',
                        pathAnimation: {
                            type: 'draw',
                            duration: 300
                        },
                        highlight: {
                            edges: true,
                            nodes: true
                        }
                    },
                    heapify: {
                        duration: 600,
                        easing: 'easeInOutBack',
                        phases: [
                            {
                                name: 'compare',
                                duration: 200,
                                highlight: '#FFD700'
                            },
                            {
                                name: 'swap',
                                duration: 300,
                                easing: 'easeOutBounce'
                            },
                            {
                                name: 'settle',
                                duration: 100,
                                effect: 'gentle-bounce'
                            }
                        ]
                    },
                    codeGeneration: {
                        duration: 200,
                        easing: 'linear',
                        textEffect: {
                            type: 'typewriter',
                            speed: 50
                        },
                        pathHighlight: {
                            color: '#2196F3',
                            width: 2,
                            dash: [5, 5]
                        }
                    },
                    frequencyUpdate: {
                        duration: 400,
                        easing: 'easeOutQuart',
                        barAnimation: {
                            type: 'height',
                            from: 'bottom'
                        }
                    }
                };
                animations.sequences = {
                    buildTree: [
                        'nodeCreation',
                        'treeConnection',
                        'heapify'
                    ],
                    generateCodes: [
                        'treeConnection',
                        'codeGeneration',
                        'frequencyUpdate'
                    ]
                };
                animations.interactions = {
                    hover: {
                        scale: 1.05,
                        duration: 150,
                        easing: 'easeOutQuad'
                    },
                    click: {
                        scale: 0.95,
                        duration: 100,
                        easing: 'easeInQuad'
                    },
                    drag: {
                        opacity: 0.8,
                        scale: 1.1,
                        shadow: true
                    }
                };
                break;
            case 'sorting':
                animations.transitions = {
                    swap: { duration: 300, easing: 'easeInOutBack' },
                    compare: { duration: 200, easing: 'easeInOut' },
                    partition: { duration: 400, easing: 'easeInOutQuad' }
                };
                break;
            // Add more cases as needed
        }

        return animations;
    }
}

module.exports = CodeAnalyzer; 