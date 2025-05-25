const CParser = require('../parsers/cParser');
const { Algorithm, MergeSortAlgorithm } = require('../models/Algorithm');

// Response formatter for consistent API responses
const ResponseFormatter = {
    success: (data, meta = {}) => ({
        success: true,
        data,
        meta: {
            timestamp: new Date().toISOString(),
            ...meta
        }
    }),
    error: (message, details = null) => ({
        success: false,
        error: message,
        details,
        meta: {
            timestamp: new Date().toISOString()
        }
    })
};

// Factory to create the appropriate algorithm instance
const createAlgorithm = (type, code, data = null) => {
    switch (type.toLowerCase()) {
        case 'mergesort':
            const algorithm = new MergeSortAlgorithm('mergeSort', code);
            if (data && Array.isArray(data)) {
                // Override the parsed data if explicitly provided
                algorithm.data = data;
            }
            return algorithm;
        case 'bubblesort':
            // Future implementation
            throw new Error('Bubble Sort visualization not yet implemented');
        case 'quicksort':
            // Future implementation
            throw new Error('Quick Sort visualization not yet implemented');
        case 'linearsearch':
            // Future implementation
            throw new Error('Linear Search visualization not yet implemented');
        case 'binarysearch':
            // Future implementation
            throw new Error('Binary Search visualization not yet implemented');
        default:
            throw new Error(`Unsupported algorithm type: ${type}. Supported types: mergeSort`);
    }
};

const generateVisualization = async (req, res) => {
    try {
        const { code, scenario = 'sorting', data = null } = req.body;

        // Validate required inputs
        if (!code || typeof code !== 'string') {
            return res.status(400).json(
                ResponseFormatter.error('Code is required and must be a string')
            );
        }

        if (code.trim().length === 0) {
            return res.status(400).json(
                ResponseFormatter.error('Code cannot be empty')
            );
        }

        // Parse the code to detect algorithm type and structure
        const parser = new CParser();
        const parseResult = parser.parse(code);

        if (parseResult.type === 'unknown') {
            return res.status(400).json(
                ResponseFormatter.error(
                    'Could not detect algorithm type from the provided code',
                    { supportedTypes: ['mergeSort'] }
                )
            );
        }

        // Create appropriate algorithm instance
        const algorithm = createAlgorithm(parseResult.type, code, data);
        
        // Initialize algorithm with parsed data
        algorithm.initialize();

        // Generate all visualization states
        const states = algorithm.getAllStates(scenario);

        // Create the visualization response
        const visualizationData = {
            algorithm: {
                type: parseResult.type,
                structure: parseResult.structure,
                initialData: parseResult.data
            },
            scenario: scenario,
            visualization: {
                states: states.map((state, index) => ({
                    stepNumber: index + 1,
                    ...state,
                    canvasLayout: {
                        width: 800,
                        height: 600,
                        scale: 1,
                        origin: { x: 400, y: 300 }
                    }
                })),
                metadata: {
                    totalSteps: states.length,
                    complexity: {
                        time: 'O(n log n)',
                        space: 'O(n)'
                    }
                }
            }
        };

        return res.json(
            ResponseFormatter.success(visualizationData, {
                algorithmType: parseResult.type,
                totalSteps: states.length
            })
        );

    } catch (error) {
        console.error('Visualization generation error:', error);
        
        if (error.message.includes('not yet implemented')) {
            return res.status(501).json(
                ResponseFormatter.error(error.message, { 
                    type: 'not_implemented' 
                })
            );
        }

        return res.status(500).json(
            ResponseFormatter.error(
                'Failed to generate visualization',
                process.env.NODE_ENV === 'development' ? error.message : undefined
            )
        );
    }
};

module.exports = {
    generateVisualization
}; 