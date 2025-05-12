const OpenAI = require('openai');
const BaseLLMProvider = require('./base');

class OpenAIProvider extends BaseLLMProvider {
    constructor(config) {
        super(config);
        this.client = null;
    }

    async initialize() {
        if (!this.config.apiKey) {
            throw new Error('OpenAI API key is required');
        }
        this.client = new OpenAI({
            apiKey: this.config.apiKey
        });
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

    async generateMetaphors(algorithmType, options = {}) {
        const prompt = `
        Generate multiple real-life metaphors for explaining the ${algorithmType} algorithm.
        Focus on creating diverse, interactive, and visually-rich scenarios that mirror the algorithm's steps.
        Include at least 2-3 different metaphors targeting different learning styles.
        
        Consider these aspects for each metaphor:
        1. Physical/Tangible representations
        2. Visual elements that can be animated
        3. Interactive elements for user engagement
        4. Step-by-step progression
        5. Clear mapping to algorithm concepts
        
        Provide the response in JSON format with the following structure:
        {
            "metaphors": [
                {
                    "name": "string",
                    "description": "string",
                    "learningStyle": "visual|kinesthetic|auditory",
                    "steps": ["string"],
                    "elements": {
                        "elementName": "metaphorical representation"
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
                    },
                    "suggestedControls": ["string"]
                }
            ]
        }
        
        Ensure each metaphor is:
        1. Easily understandable by non-technical users
        2. Visually representable in a web interface
        3. Suitable for interactive animation
        4. Mapped clearly to algorithm steps
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