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
            
            // Check if the response is already a parsed object (from successful JSON parse in provider)
            if (typeof response === 'object' && response !== null) {
                 parsedResponse = response;
                 console.log('Received parsed object from provider.');
            } else if (typeof response === 'string') {
                 // If it's a string, the provider failed to parse JSON. Log the content.
                 console.error('Provider returned a string, indicating JSON parse failure.');
                 console.error('Unparsable response content:', response);
                 // Throw a more specific error
                 throw new Error('LLM response was not valid JSON.');
            } else {
                 // Handle unexpected response types
                 console.error('Provider returned unexpected type:', typeof response);
                 throw new Error('Unexpected response type from LLM provider.');
            }

            // Ensure the response has the required structure (now assuming it's a parsed object)
            // Validate LLM response structure, expecting { success: ..., simulatedTrace: { steps: [...] } } - this validation should stay in the route handler
            // This analyzer is only responsible for getting a parsed object or throwing if not possible.

            // The route handler now expects a structured object here, not just the trace.
            // We'll pass the full parsed response from the provider.
            return parsedResponse; 
            
        } catch (error) {
            console.error('Analysis error in CodeAnalyzer:', error);
            // Re-throw specific errors or wrap generic ones
            if (error.message.includes('LLM response was not valid JSON') || error.message.includes('Unexpected response type from LLM provider')) {
                throw error; // Re-throw specific errors
            } else {
                 return {
                    success: false,
                    error: error.message || 'Analysis failed'
                 };
            }
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