const express = require('express');
const router = express.Router();
const exampleManager = require('../services/examples/exampleManager');

// Get all examples or filter by algorithm type
router.get('/', async (req, res) => {
    try {
        const { algorithmType } = req.query;
        const examples = await exampleManager.getExamples(algorithmType);
        res.json({ success: true, examples });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get example by ID
router.get('/:id', async (req, res) => {
    try {
        const example = await exampleManager.getExampleById(req.params.id);
        if (!example) {
            return res.status(404).json({ success: false, error: 'Example not found' });
        }
        res.json({ success: true, example });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete example by ID
router.delete('/:id', async (req, res) => {
    try {
        const success = await exampleManager.deleteExample(req.params.id);
        if (!success) {
            return res.status(404).json({ success: false, error: 'Example not found' });
        }
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router; 