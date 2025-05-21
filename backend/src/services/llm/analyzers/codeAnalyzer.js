const LLMFactory = require('../factory');

class CodeAnalyzer {
    constructor(provider) {
        if (!provider) {
            throw new Error('Provider is required for CodeAnalyzer');
        }
        this.provider = provider;
    }

    async initialize() {
        await this.provider.initialize();
    }

    async analyze(prompt) {
        try {
            const response = await this.provider.analyze(prompt);
            let parsedResponse;
            
            try {
                parsedResponse = typeof response === 'string' ? JSON.parse(response) : response;
            } catch (error) {
                console.error('Failed to parse response:', response);
                throw new Error('Invalid JSON response from provider');
            }

            // Ensure the response has the required structure
            if (!parsedResponse || typeof parsedResponse !== 'object') {
                throw new Error('Invalid response format: expected an object');
            }

            // Add success field if not present
            if (!('success' in parsedResponse)) {
                parsedResponse = { success: true, ...parsedResponse };
            }

            return parsedResponse;
        } catch (error) {
            console.error('Analysis error:', error);
            return {
                success: false,
                error: error.message || 'Analysis failed'
            };
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