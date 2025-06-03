const OpenAI = require('openai');
const BaseLLMProvider = require('./base');

class OpenAIProvider extends BaseLLMProvider {
    constructor(config) {
        super(config);
        this.client = null;
        console.log('OpenAIProvider initialized with config:', config);
    }

    async initialize() {
        console.log('Initializing OpenAI provider...');
        if (!this.client) {
            if (!process.env.OPENAI_API_KEY) {
                console.error('OPENAI_API_KEY environment variable is not set');
                throw new Error('OPENAI_API_KEY environment variable is not set');
            }
            try {
                console.log('Creating OpenAI client...');
                this.client = new OpenAI({
                    apiKey: process.env.OPENAI_API_KEY
                });
                console.log('OpenAI client created successfully');
            } catch (error) {
                console.error('Failed to initialize OpenAI client:', error);
                throw new Error(`OpenAI initialization failed: ${error.message}`);
            }
        }
    }

    async analyze(prompt, options = {}) {
        console.log('Starting OpenAI analysis...');
        if (!this.client) {
            console.log('Client not initialized, initializing now...');
            await this.initialize();
        }
        
        try {
            console.log('Sending request to OpenAI chat completions...');
            const response = await this.client.chat.completions.create({
                model: options.model || 'gpt-4',
                messages: [{ role: 'user', content: prompt }],
                temperature: options.temperature || 0.7,
                max_tokens: options.maxTokens || 2000
            });

            console.log('Received raw response from OpenAI.');
            
            // Check if response and choices are valid
            if (!response || !response.choices || response.choices.length === 0) {
                 console.error('Invalid or empty response from OpenAI', response);
                 throw new Error('Invalid or empty response from OpenAI');
            }

            let content = response.choices[0].message.content;
            console.log('Extracted content from OpenAI response.');
            
            // Use a more flexible regex to find the JSON markdown block anywhere in the content
            const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
            if (jsonMatch && jsonMatch[1]) {
                content = jsonMatch[1];
                console.log('Extracted JSON content from markdown block.');
            } else {
                console.log('Content does not appear to contain a JSON markdown block.');
                // Optionally, log the content that wasn't parsed as JSON for debugging
                // console.log('Unparsed content:', content);
            }

            // Try to parse the (potentially extracted) content as JSON
            try {
                console.log('Attempting to parse content as JSON...');
                const parsedContent = JSON.parse(content);
                console.log('Successfully parsed content as JSON.');
                return parsedContent;
            } catch (parseError) {
                console.log('Content is not valid JSON, returning as string.', parseError.message);
                // If JSON parsing fails even after extraction, it might not be the expected JSON format
                // Return the original content or an error depending on desired behavior
                // For now, we'll return the content as is, letting the caller handle it
                return content; // Or throw an error if strict JSON is required
            }
        } catch (error) {
            console.error('OpenAI API call failed:', {
                name: error.name,
                message: error.message,
                status: error.status,
                response: error.response?.data // Log response data if available
            });
            throw new Error(`OpenAI API error: ${error.message}`);
        }
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