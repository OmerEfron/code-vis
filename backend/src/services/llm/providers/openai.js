const OpenAI = require('openai');
const BaseLLMProvider = require('./base');

class OpenAIProvider extends BaseLLMProvider {
    constructor(config) {
        super(config);
        this.client = null;
        this.retryAttempts = config?.retryAttempts || 3;
        this.retryDelay = config?.retryDelay || 1000;
    }

    async initialize() {
        if (!this.client) {
            if (!process.env.OPENAI_API_KEY) {
                throw new Error('OPENAI_API_KEY environment variable is not set');
            }
            try {
                this.client = new OpenAI({
                    apiKey: process.env.OPENAI_API_KEY
                });
                
                // Test the connection
                await this.client.models.list();
                console.log('OpenAI client initialized successfully');
            } catch (error) {
                console.error('Failed to initialize OpenAI client:', error);
                throw new Error(`OpenAI initialization failed: ${error.message}`);
            }
        }
    }

    async analyze(prompt, options = {}) {
        if (!this.client) await this.initialize();
        
        const maxRetries = options.maxRetries || this.retryAttempts;
        let lastError;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const response = await this.client.chat.completions.create({
                    model: options.model || 'gpt-3.5-turbo',
                    messages: [{ 
                        role: 'system', 
                        content: 'You are an expert algorithm analyst. Always respond with valid JSON that matches the requested schema exactly.' 
                    }, { 
                        role: 'user', 
                        content: prompt 
                    }],
                    temperature: options.temperature || 0.3,
                    max_tokens: options.maxTokens || 4000,
                    response_format: { type: "json_object" }
                });

                const content = response.choices[0].message.content;
                
                // Validate JSON response
                try {
                    const parsed = JSON.parse(content);
                    return parsed;
                } catch (parseError) {
                    console.warn(`Attempt ${attempt}: Invalid JSON response, retrying...`);
                    lastError = new Error(`Invalid JSON response: ${parseError.message}`);
                    
                    if (attempt === maxRetries) {
                        throw lastError;
                    }
                    
                    await this._sleep(this.retryDelay * attempt);
                    continue;
                }
            } catch (error) {
                console.error(`Attempt ${attempt} failed:`, error.message);
                lastError = error;
                
                if (attempt === maxRetries) {
                    throw new Error(`OpenAI API failed after ${maxRetries} attempts: ${error.message}`);
                }
                
                await this._sleep(this.retryDelay * attempt);
            }
        }
    }

    async detectAlgorithm(code, options = {}) {
        const prompt = `
        Analyze the following code and identify the algorithm it implements.
        Respond with ONLY a valid JSON object matching this exact schema:
        
        {
            "algorithmType": "string - specific algorithm name (e.g., 'Bubble Sort', 'Binary Search')",
            "category": "string - algorithm category (e.g., 'Sorting', 'Searching', 'Graph Traversal')",
            "timeComplexity": "string - Big O notation (e.g., 'O(n)', 'O(log n)')",
            "spaceComplexity": "string - Big O notation (e.g., 'O(1)', 'O(n)')",
            "confidence": "number between 0 and 1",
            "explanation": "string - detailed explanation of the algorithm and its behavior",
            "keyFeatures": ["array of strings describing key characteristics"],
            "bestCaseComplexity": "string - Big O for best case",
            "worstCaseComplexity": "string - Big O for worst case",
            "averageCaseComplexity": "string - Big O for average case"
        }
        
        Code to analyze:
        ${code}
        `;

        return await this.analyze(prompt, options);
    }

    async extractInputs(code, options = {}) {
        const prompt = `
        Analyze the following code and identify its inputs, parameters, and example usage.
        Respond with ONLY a valid JSON object matching this exact schema:
        
        {
            "inputs": [
                {
                    "name": "string - parameter name",
                    "type": "string - data type (array, string, number, etc.)",
                    "description": "string - what this input represents",
                    "constraints": ["array of strings describing limitations"],
                    "defaultValue": "any - default value if applicable",
                    "required": "boolean - whether this input is required"
                }
            ],
            "examples": [
                {
                    "input": "object with actual input values",
                    "expectedOutput": "the expected result",
                    "description": "string - what this example demonstrates"
                }
            ]
        }
        
        Code to analyze:
        ${code}
        `;

        return await this.analyze(prompt, options);
    }

    async generateMetaphors(code, options = {}) {
        const prompt = `
        Create 2-3 creative metaphors for visualizing the following algorithm code.
        Each metaphor should be suitable for different learning styles and easy to animate.
        Respond with ONLY a valid JSON object matching this exact schema:
        
        {
            "metaphors": [
                {
                    "name": "string - metaphor name",
                    "description": "string - detailed explanation of the metaphor",
                    "learningStyle": "string - must be 'visual', 'auditory', or 'kinesthetic'",
                    "steps": ["array of strings - step-by-step process in metaphor terms"],
                    "elements": {
                        "key": "value - mapping algorithm elements to metaphor elements"
                    },
                    "visualProperties": {
                        "primaryElements": ["main visual components"],
                        "secondaryElements": ["supporting visual elements"],
                        "animations": ["types of animations needed"],
                        "interactiveElements": ["clickable/hoverable elements"],
                        "layout": {
                            "type": "string - layout type (grid, linear, tree, etc.)",
                            "arrangement": "string - how elements are arranged"
                        },
                        "colorScheme": {
                            "primary": "CSS color value",
                            "secondary": "CSS color value", 
                            "highlight": "CSS color value",
                            "success": "CSS color value",
                            "warning": "CSS color value"
                        }
                    },
                    "suggestedControls": ["recommended control elements"],
                    "educationalValue": "string - what this metaphor teaches best"
                }
            ]
        }
        
        Code to analyze:
        ${code}
        `;

        return await this.analyze(prompt, {
            ...options,
            temperature: 0.7,
            maxTokens: 5000
        });
    }

    async generateVisualizationSuggestions(analysisResult, options = {}) {
        const prompt = `
        Based on this algorithm analysis, suggest specific visualization parameters and techniques.
        Respond with ONLY a valid JSON object:
        
        {
            "visualization": {
                "type": "string - visualization type",
                "layout": {
                    "orientation": "horizontal or vertical",
                    "dimensions": { "width": number, "height": number },
                    "sections": { "area_name": "percentage or pixels" }
                },
                "animations": {
                    "duration": "number - milliseconds",
                    "easing": "string - easing function",
                    "keyFrames": ["array of animation steps"]
                },
                "interactivity": {
                    "controls": ["play", "pause", "step", "reset", "speed"],
                    "hoverEffects": ["elements that respond to hover"],
                    "clickActions": ["elements that respond to clicks"]
                },
                "performance": {
                    "maxElements": "number - suggested max for smooth performance",
                    "updateFrequency": "number - milliseconds between updates",
                    "optimizations": ["suggested performance optimizations"]
                }
            }
        }
        
        Analysis result:
        ${JSON.stringify(analysisResult, null, 2)}
        `;

        return await this.analyze(prompt, options);
    }

    async _sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = OpenAIProvider; 