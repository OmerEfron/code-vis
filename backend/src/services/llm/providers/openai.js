const OpenAI = require('openai');
const BaseLLMProvider = require('./base');

class OpenAIProvider extends BaseLLMProvider {
    constructor(config) {
        super(config);
        this.client = null;
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
            } catch (error) {
                console.error('Failed to initialize OpenAI client:', error);
                throw new Error(`OpenAI initialization failed: ${error.message}`);
            }
        }
    }

    async analyze(prompt, options = {}) {
        if (!this.client) await this.initialize();
        
        const response = await this.client.chat.completions.create({
            model: options.model || 'gpt-4',
            messages: [{ role: 'user', content: prompt }],
            temperature: options.temperature || 0.7,
            max_tokens: options.maxTokens || 2000
        });

        return response.choices[0].message.content;
    }

    async detectAlgorithm(code, options = {}) {
        const prompt = `
        Analyze the following code and identify the algorithm it implements.
        Focus on identifying common algorithms like sorting, searching, graph traversal, etc.
        Also provide the time and space complexity.
        
        Code:
        ${code}
        
        Provide the response in JSON format with the following structure:
        {
            "algorithmType": "string",
            "category": "string",
            "timeComplexity": "string",
            "spaceComplexity": "string",
            "confidence": number (0-1),
            "explanation": "string"
        }
        `;

        const response = await this.analyze(prompt, options);
        return JSON.parse(response);
    }

    async extractInputs(code, options = {}) {
        const prompt = `
        Analyze the following code and identify its inputs, their types, and constraints.
        
        Code:
        ${code}
        
        Provide the response in JSON format with the following structure:
        {
            "inputs": [
                {
                    "name": "string",
                    "type": "string",
                    "constraints": ["string"],
                    "description": "string"
                }
            ],
            "examples": [
                {
                    "input": "example input value",
                    "expectedOutput": "expected output value"
                }
            ]
        }
        `;

        const response = await this.analyze(prompt, options);
        return JSON.parse(response);
    }

    async generateMetaphors(code, options = {}) {
        const prompt = `
        Create visualization-friendly metaphors for explaining the following code.
        Focus on creating metaphors that can be easily visualized and animated.
        
        Code:
        ${code}
        
        Provide the response in JSON format with the following structure:
        {
            "metaphors": [
                {
                    "name": "string",
                    "description": "string",
                    "learningStyle": "visual" | "auditory" | "kinesthetic",
                    "steps": ["string"],
                    "elements": {
                        "elementName": "description"
                    },
                    "visualProperties": {
                        "primaryElements": ["string"],
                        "secondaryElements": ["string"],
                        "animations": ["string"],
                        "interactiveElements": ["string"],
                        "layout": {
                            "type": "string",
                            "arrangement": "string"
                        },
                        "colorScheme": {
                            "primary": "string",
                            "secondary": "string",
                            "highlight": "string"
                        }
                    }
                }
            ]
        }
        `;

        const response = await this.analyze(prompt, {
            ...options,
            temperature: 0.8,  // Increased for more creative responses
            max_tokens: 3000   // Increased for longer, more detailed responses
        });
        return JSON.parse(response);
    }
}

module.exports = OpenAIProvider; 