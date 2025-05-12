const express = require('express');
const router = express.Router();
const { generateVisualization } = require('../controllers/visualizationController');

// Endpoint to generate visualization states
router.post('/generate', async (req, res) => {
    try {
        const { code, scenario } = req.body;

        // Validate input
        if (!code || !scenario) {
            return res.status(400).json({
                success: false,
                error: 'Both code and scenario are required'
            });
        }

        // Generate visualization
        const visualization = await generateVisualization(code, scenario);
        res.json(visualization);

    } catch (error) {
        console.error('Visualization generation error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

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