const CParser = require('../parsers/cParser');
const { Algorithm, MergeSortAlgorithm } = require('../models/Algorithm');

// Factory to create the appropriate algorithm instance
const createAlgorithm = (type, code) => {
    switch (type.toLowerCase()) {
        case 'mergesort':
            return new MergeSortAlgorithm('mergeSort', code);
        // Add more algorithm types here
        default:
            throw new Error(`Unsupported algorithm type: ${type}`);
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