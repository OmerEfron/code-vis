const express = require('express');
const router = express.Router();
const { validateAnalysisResponse } = require('../schemas/validateSchema');
const schema = require('../schemas/analysisSchema.json');
const LLMFactory = require('../services/llm/factory');
const exampleManager = require('../services/examples/exampleManager');

// Initialize the analyzer
let analyzer = null;

// Middleware to ensure analyzer is initialized
const ensureAnalyzer = async (req, res, next) => {
    if (!analyzer) {
        try {
            analyzer = LLMFactory.createAnalyzer();
            await analyzer.initialize();
        } catch (error) {
            console.error('Failed to initialize LLM analyzer:', error);
            return res.status(500).json({
                success: false,
                error: 'Failed to initialize LLM provider',
                details: error.message
            });
        }
    }
    next();
};

// Get available LLM providers
router.get('/providers', (req, res) => {
    const providers = LLMFactory.getAvailableProviders();
    res.json({ providers });
});

// Analyze code using LLM
router.post('/', ensureAnalyzer, async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) {
            return res.status(400).json({
                success: false,
                error: 'No code provided'
            });
        }

        // Add schema to the prompt context so LLM knows the expected format
        const prompt = `
You are a code analysis expert tasked with analyzing algorithms and generating visualization-friendly descriptions. Your analysis must strictly follow the provided JSON schema format.

Task:
1. Analyze the given code to identify the algorithm type, complexity, and key characteristics
2. Generate clear, step-by-step explanations using metaphors that help visualize the algorithm
3. Provide properly formatted input examples that the visualization can use
4. Structure the response exactly according to the schema below

Important Requirements:
- The response MUST be valid JSON and match this schema exactly
- All required fields must be present
- Metaphors should be visualization-friendly and include clear visual properties
- Examples must use the exact format: {a: [...], n: number, x: number}
- Color schemes should use valid CSS color values
- Steps should be granular enough for smooth animations
- Learning styles should be one of: "visual", "auditory", "kinesthetic"

Schema:
${JSON.stringify(schema, null, 2)}

Example of a good metaphor:
{
  "name": "Library Bookshelf",
  "description": "Imagine books arranged by height on a shelf, where each book represents a number in the array",
  "learningStyle": "visual",
  "steps": [
    "Start at the middle shelf",
    "Compare the book height with target height",
    "Move to upper or lower shelf based on comparison",
    "Repeat until the right book is found"
  ],
  "elements": {
    "books": "array elements",
    "shelf": "current position",
    "height": "value comparison"
  },
  "visualProperties": {
    "primaryElements": ["book", "shelf-marker"],
    "secondaryElements": ["height-indicator", "direction-arrow"],
    "animations": ["slide", "highlight", "compare"],
    "interactiveElements": ["clickable-books", "slider"],
    "layout": {
      "type": "horizontal",
      "arrangement": "linear"
    },
    "colorScheme": {
      "primary": "#4A90E2",
      "secondary": "#F5A623",
      "highlight": "#7ED321"
    }
  }
}

Code to analyze:
${code}

Return ONLY the JSON response matching the schema exactly. Do not include any additional text or explanations outside the JSON structure.`;

        // Call LLM service with the prompt
        const llmResponse = await analyzer.analyze(prompt);

        // Validate the LLM response against our schema
        const validation = validateAnalysisResponse(llmResponse);
        if (!validation.valid) {
            console.error('LLM response validation failed:', validation.errors);
            return res.status(500).json({
                success: false,
                error: 'Analysis failed schema validation',
                validationErrors: validation.errors
            });
        }

        // Get visualization suggestions
        const visualizationSuggestions = await analyzer.suggestVisualization(llmResponse.analysis);

        // Ensure examples are properly formatted for frontend evaluation
        if (llmResponse.analysis?.inputs?.examples) {
            llmResponse.analysis.inputs.examples = llmResponse.analysis.inputs.examples.map(example => {
                // If input is a string representation of an object, ensure it's properly formatted
                if (typeof example.input === 'string' && example.input.includes(':')) {
                    try {
                        // Remove any potential harmful content and format as proper object
                        const cleanInput = example.input
                            .replace(/[^{}\[\],\s\w:.-]/g, '')
                            .replace(/(\w+):/g, '"$1":');
                        example.input = JSON.parse(`{${cleanInput}}`);
                    } catch (err) {
                        console.error('Failed to parse example input:', err);
                        example.input = { a: [1, 2, 3, 4, 5], n: 5, x: 3 };
                    }
                }
                return example;
            });
        }

        // If analysis is successful and has metaphors, save as example
        if (llmResponse.success && llmResponse.analysis?.metaphors?.length > 0) {
            await exampleManager.saveExample(llmResponse);
        }

        res.json({
            success: true,
            analysis: llmResponse.analysis,
            visualization: visualizationSuggestions
        });

    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to analyze code',
            details: error.message
        });
    }
});

module.exports = router; 