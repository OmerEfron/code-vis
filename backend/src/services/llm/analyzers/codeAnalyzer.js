const LLMFactory = require('../factory');
const { BaseAnalyzer } = require('./baseAnalyzer');

class CodeAnalyzer extends BaseAnalyzer {
    constructor(provider) {
        if (!provider) {
            throw new Error('Provider is required for CodeAnalyzer');
        }
        super(provider);
    }

    async initialize() {
        await this.provider.initialize();
    }

    async analyze(prompt) {
        try {
            console.log('CodeAnalyzer: Sending prompt to provider.analyze');
            const resultFromProvider = await this.provider.analyze(prompt);
            
            console.log('CodeAnalyzer: Received response from provider.analyze', typeof resultFromProvider);

            // Check if the result is a parsed object
            if (typeof resultFromProvider === 'object' && resultFromProvider !== null) {
                console.log('CodeAnalyzer: Provider returned a parsed object.');
                
                // Validate the response structure
                if (resultFromProvider.steps && Array.isArray(resultFromProvider.steps) && 
                    resultFromProvider.finalState && typeof resultFromProvider.finalState === 'object') {
                    return resultFromProvider;
                } else {
                    console.error('CodeAnalyzer: Provider returned object with invalid structure:', resultFromProvider);
                    throw new Error('LLM provider returned object with invalid structure');
                }
            } else {
                console.error('CodeAnalyzer: Provider returned unexpected type:', typeof resultFromProvider);
                throw new Error(`LLM provider returned unexpected type: ${typeof resultFromProvider}`);
            }
        } catch (error) {
            console.error('Analysis error in CodeAnalyzer:', error);
            throw error;
        }
    }

    async analyzeCode(code) {
        if (!code || typeof code !== 'string') {
            return {
                success: false,
                error: 'No code provided or invalid code format'
            };
        }

        try {
            // Run all analyses in parallel for efficiency
            const [algorithmResponse, inputResponse, metaphorResponse] = await Promise.all([
                this.provider.detectAlgorithm(code),
                this.provider.extractInputs(code),
                this.provider.generateMetaphors(code)
            ]);

            // Ensure each response has the correct structure
            const algorithm = algorithmResponse?.algorithm || algorithmResponse || {
                algorithmType: 'unknown',
                category: 'unknown',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(1)',
                explanation: 'Could not determine algorithm details'
            };

            const inputs = inputResponse?.inputs || inputResponse || [];
            const metaphors = (metaphorResponse?.metaphors || metaphorResponse || []).map(metaphor => ({
                name: metaphor.name || 'Unnamed Metaphor',
                description: metaphor.description || 'No description available',
                learningStyle: metaphor.learningStyle || 'visual',
                steps: metaphor.steps || [],
                elements: metaphor.elements || {},
                visualProperties: metaphor.visualProperties || {
                    primaryElements: [],
                    secondaryElements: [],
                    animations: [],
                    interactiveElements: [],
                    layout: { type: 'default', arrangement: 'linear' },
                    colorScheme: {
                        primary: '#4A90E2',
                        secondary: '#F5A623',
                        highlight: '#7ED321'
                    }
                }
            }));

            // Return the properly structured response
            return {
                success: true,
                analysis: {
                    algorithm,
                    inputs,
                    metaphors
                }
            };
        } catch (error) {
            console.error('Code analysis error:', error);
            return {
                success: false,
                error: error.message || 'Failed to analyze code',
                analysis: {
                    algorithm: {
                        algorithmType: 'unknown',
                        category: 'unknown',
                        timeComplexity: 'O(n)',
                        spaceComplexity: 'O(1)',
                        explanation: 'Analysis failed'
                    },
                    inputs: [],
                    metaphors: []
                }
            };
        }
    }

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
        const { algorithmType } = analysis.algorithm;
        
        // Default visual elements
        const elements = {
            primary: [],
            secondary: [],
            controls: ['play', 'pause', 'step', 'speed', 'reset'],
            metrics: {
                basic: ['comparisons', 'swaps', 'memory-usage'],
                advanced: ['time-complexity', 'space-complexity', 'current-phase']
            }
        };

        // Customize based on algorithm type
        switch (algorithmType?.toLowerCase()) {
            case 'sorting':
                elements.primary = ['array', 'comparisons', 'swaps'];
                elements.secondary = ['pivots', 'partitions', 'merge-zones'];
                break;
            case 'searching':
                elements.primary = ['array', 'current', 'target'];
                elements.secondary = ['range', 'midpoint', 'search-history'];
                break;
            case 'graph':
                elements.primary = ['nodes', 'edges', 'current-path'];
                elements.secondary = ['visited', 'queue', 'stack'];
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
                padding: 20
            }
        };

        // Customize based on algorithm type
        switch (algorithmType?.toLowerCase()) {
            case 'sorting':
                layout.orientation = 'horizontal';
                layout.sections = {
                    array: { height: '60%' },
                    metrics: { height: '20%' },
                    controls: { height: '20%' }
                };
                break;
            default:
                layout.sections = {
                    main: { height: '70%' },
                    controls: { height: '10%' },
                    metrics: { height: '20%' }
                };
        }

        return layout;
    }

    _suggestAnimations(analysis) {
        const { algorithmType } = analysis.algorithm;
        
        // Base animation configuration
        const animations = {
            duration: 500,
            easing: 'easeInOutQuad',
            transitions: {}
        };

        // Customize based on algorithm type
        switch (algorithmType?.toLowerCase()) {
            case 'sorting':
                animations.transitions = {
                    swap: { duration: 300, easing: 'easeInOutBack' },
                    compare: { duration: 200, easing: 'easeInOut' },
                    partition: { duration: 400, easing: 'easeInOutQuad' }
                };
                break;
            default:
                animations.transitions = {
                    default: { duration: 300, easing: 'easeInOutQuad' }
                };
        }

        return animations;
    }
}

module.exports = CodeAnalyzer; 