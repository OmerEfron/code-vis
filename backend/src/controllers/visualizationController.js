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

const generateVisualization = async (code, scenario) => {
    // Parse the code to detect algorithm type and structure
    const parser = new CParser();
    const parseResult = parser.parse(code);

    // Create appropriate algorithm instance
    const algorithm = createAlgorithm(parseResult.type, code);
    
    // Initialize algorithm with parsed data
    algorithm.initialize();

    // Generate all visualization states
    const states = algorithm.getAllStates(scenario);

    // Create the visualization object
    return {
        success: true,
        algorithm: parseResult.type,
        scenario: scenario,
        metadata: {
            totalSteps: states.length,
            algorithmStructure: parseResult.structure
        },
        states: states.map((state, index) => ({
            stepNumber: index + 1,
            ...state,
            canvasLayout: {
                width: 800,
                height: 600,
                scale: 1,
                origin: { x: 400, y: 300 }
            }
        }))
    };
};

module.exports = {
    generateVisualization
}; 