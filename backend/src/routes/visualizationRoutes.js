const express = require('express');
const router = express.Router();
const { generateVisualization } = require('../controllers/visualizationController');
const { 
    validateVisualizationRequest, 
    sanitizeCode, 
    visualizationLimiter 
} = require('../middleware/validation');

// Endpoint to generate visualization states
router.post('/generate', 
    visualizationLimiter,
    sanitizeCode,
    validateVisualizationRequest,
    generateVisualization
);

// Get available scenarios
router.get('/scenarios', (req, res) => {
    // Example scenarios - this could be moved to a database or config file
    const scenarios = {
        'mergeSort': {
            name: 'Teacher Organizing Exams',
            description: 'A teacher organizing exam papers by scores',
            metaphor: {
                array: 'Stack of exam papers',
                elements: 'Individual exam papers',
                comparisons: 'Comparing exam scores',
                swaps: 'Rearranging papers in order',
                splits: 'Dividing papers into smaller piles',
                merges: 'Combining sorted piles'
            },
            visualProperties: {
                paperSize: { width: 40, height: 60 },
                stackSpacing: 20,
                pileOffset: { x: 100, y: 50 }
            }
        }
    };
    
    res.json(scenarios);
});

module.exports = router; 