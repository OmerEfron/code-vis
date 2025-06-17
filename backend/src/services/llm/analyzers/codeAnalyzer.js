const LLMFactory = require('../factory');

class CodeAnalyzer {
    constructor(provider) {
        if (!provider) {
            throw new Error('Provider is required for CodeAnalyzer');
        }
        this.provider = provider;
        this.analysisCache = new Map();
        this.cacheTimeout = 30 * 60 * 1000; // 30 minutes
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

        // Check cache first
        const cacheKey = this._generateCacheKey(code);
        const cached = this.analysisCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            console.log('Returning cached analysis');
            return cached.result;
        }

        try {
            // Run all analyses in parallel for efficiency
            const [algorithmResponse, inputResponse, metaphorResponse] = await Promise.allSettled([
                this.provider.detectAlgorithm(code),
                this.provider.extractInputs(code),
                this.provider.generateMetaphors(code)
            ]);

            // Process algorithm analysis
            const algorithm = this._processAlgorithmResponse(algorithmResponse);
            
            // Process inputs analysis
            const inputs = this._processInputsResponse(inputResponse);
            
            // Process metaphors analysis
            const metaphors = this._processMetaphorsResponse(metaphorResponse);

            // Construct the final response
            const result = {
                success: true,
                analysis: {
                    algorithm,
                    inputs,
                    metaphors
                }
            };

            // Cache the result
            this.analysisCache.set(cacheKey, {
                result,
                timestamp: Date.now()
            });

            // Clean up old cache entries
            this._cleanupCache();

            return result;
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
                        explanation: 'Analysis failed due to an error'
                    },
                    inputs: [],
                    metaphors: []
                }
            };
        }
    }

    _processAlgorithmResponse(response) {
        if (response.status === 'fulfilled' && response.value) {
            const data = response.value;
            return {
                algorithmType: data.algorithmType || 'Unknown Algorithm',
                category: data.category || 'General',
                timeComplexity: data.timeComplexity || 'O(n)',
                spaceComplexity: data.spaceComplexity || 'O(1)',
                confidence: data.confidence || 0.5,
                explanation: data.explanation || 'No explanation available',
                keyFeatures: data.keyFeatures || [],
                bestCaseComplexity: data.bestCaseComplexity || data.timeComplexity || 'O(n)',
                worstCaseComplexity: data.worstCaseComplexity || data.timeComplexity || 'O(n)',
                averageCaseComplexity: data.averageCaseComplexity || data.timeComplexity || 'O(n)'
            };
        }
        
        return {
            algorithmType: 'Analysis Failed',
            category: 'Unknown',
            timeComplexity: 'O(n)',
            spaceComplexity: 'O(1)',
            confidence: 0,
            explanation: response.reason?.message || 'Failed to analyze algorithm',
            keyFeatures: [],
            bestCaseComplexity: 'O(n)',
            worstCaseComplexity: 'O(n)',
            averageCaseComplexity: 'O(n)'
        };
    }

    _processInputsResponse(response) {
        if (response.status === 'fulfilled' && response.value) {
            const data = response.value;
            const processedInputs = (data.inputs || []).map(input => ({
                name: input.name || 'unknown',
                type: input.type || 'any',
                description: input.description || 'No description available',
                constraints: input.constraints || [],
                defaultValue: input.defaultValue,
                required: input.required !== false
            }));

            const processedExamples = (data.examples || []).map(example => ({
                input: example.input || {},
                expectedOutput: example.expectedOutput || '',
                description: example.description || 'Example usage'
            }));

            return {
                inputs: processedInputs,
                examples: processedExamples
            };
        }
        
        return {
            inputs: [{
                name: 'input',
                type: 'any',
                description: 'Failed to analyze inputs',
                constraints: [],
                required: true
            }],
            examples: []
        };
    }

    _processMetaphorsResponse(response) {
        if (response.status === 'fulfilled' && response.value) {
            const data = response.value;
            return (data.metaphors || []).map(metaphor => ({
                name: metaphor.name || 'Unnamed Metaphor',
                description: metaphor.description || 'No description available',
                learningStyle: this._validateLearningStyle(metaphor.learningStyle),
                steps: metaphor.steps || [],
                elements: metaphor.elements || {},
                visualProperties: {
                    primaryElements: metaphor.visualProperties?.primaryElements || [],
                    secondaryElements: metaphor.visualProperties?.secondaryElements || [],
                    animations: metaphor.visualProperties?.animations || ['fade', 'slide'],
                    interactiveElements: metaphor.visualProperties?.interactiveElements || [],
                    layout: {
                        type: metaphor.visualProperties?.layout?.type || 'linear',
                        arrangement: metaphor.visualProperties?.layout?.arrangement || 'horizontal'
                    },
                    colorScheme: {
                        primary: metaphor.visualProperties?.colorScheme?.primary || '#3b82f6',
                        secondary: metaphor.visualProperties?.colorScheme?.secondary || '#8b5cf6',
                        highlight: metaphor.visualProperties?.colorScheme?.highlight || '#f59e0b',
                        success: metaphor.visualProperties?.colorScheme?.success || '#10b981',
                        warning: metaphor.visualProperties?.colorScheme?.warning || '#f59e0b'
                    }
                },
                suggestedControls: metaphor.suggestedControls || ['play', 'pause', 'step'],
                educationalValue: metaphor.educationalValue || 'Provides visual understanding of the algorithm'
            }));
        }
        
        return [];
    }

    _validateLearningStyle(style) {
        const validStyles = ['visual', 'auditory', 'kinesthetic'];
        return validStyles.includes(style) ? style : 'visual';
    }

    _generateCacheKey(code) {
        // Simple hash function for cache key
        let hash = 0;
        for (let i = 0; i < code.length; i++) {
            const char = code.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    }

    _cleanupCache() {
        const now = Date.now();
        for (const [key, value] of this.analysisCache.entries()) {
            if (now - value.timestamp > this.cacheTimeout) {
                this.analysisCache.delete(key);
            }
        }
    }

    async suggestVisualization(analysisResult) {
        try {
            const suggestions = await this.provider.generateVisualizationSuggestions(analysisResult);
            return {
                success: true,
                suggestions
            };
        } catch (error) {
            console.error('Visualization suggestion error:', error);
            return {
                success: false,
                error: error.message,
                suggestions: this._getDefaultVisualizationSuggestions(analysisResult)
            };
        }
    }

    _getDefaultVisualizationSuggestions(analysisResult) {
        const { algorithmType } = analysisResult.analysis?.algorithm || {};
        
        return {
            visualization: {
                type: this._mapAlgorithmToVisualizationType(algorithmType),
                layout: {
                    orientation: 'horizontal',
                    dimensions: { width: 800, height: 600 },
                    sections: {
                        main: '70%',
                        controls: '15%',
                        info: '15%'
                    }
                },
                animations: {
                    duration: 500,
                    easing: 'ease-in-out',
                    keyFrames: ['highlight', 'move', 'compare', 'swap']
                },
                interactivity: {
                    controls: ['play', 'pause', 'step', 'reset', 'speed'],
                    hoverEffects: ['highlight', 'tooltip'],
                    clickActions: ['select', 'focus']
                },
                performance: {
                    maxElements: 100,
                    updateFrequency: 60,
                    optimizations: ['virtualization', 'batching']
                }
            }
        };
    }

    _mapAlgorithmToVisualizationType(algorithmType) {
        const type = algorithmType?.toLowerCase() || '';
        
        if (type.includes('sort')) return 'array-visualization';
        if (type.includes('search')) return 'search-visualization';
        if (type.includes('tree') || type.includes('binary')) return 'tree-visualization';
        if (type.includes('graph')) return 'graph-visualization';
        if (type.includes('dynamic') || type.includes('dp')) return 'matrix-visualization';
        
        return 'generic-visualization';
    }

    // Cleanup method for graceful shutdown
    cleanup() {
        this.analysisCache.clear();
    }
}

module.exports = CodeAnalyzer; 