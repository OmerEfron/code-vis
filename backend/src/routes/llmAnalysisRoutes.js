const express = require('express');
const router = express.Router();
const CodeAnalyzer = require('../services/llm/analyzers/codeAnalyzer');
const LLMFactory = require('../services/llm/factory');

// Initialize the analyzer with the default provider (OpenAI)
let analyzer = null;

// Middleware to ensure analyzer is initialized
const ensureAnalyzer = async (req, res, next) => {
    if (!analyzer) {
        try {
            analyzer = new CodeAnalyzer('openai', {
                apiKey: process.env.OPENAI_API_KEY
            });
            await analyzer.initialize();
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: 'Failed to initialize LLM provider'
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
router.post('/analyze', ensureAnalyzer, async (req, res) => {
    try {
        const { code } = req.body;
        
        if (!code) {
            return res.status(400).json({
                success: false,
                error: 'Code is required'
            });
        }

        const analysis = await analyzer.analyzeCode(code);
        
        if (!analysis.success) {
            return res.status(500).json(analysis);
        }

        // Get visualization suggestions
        const visualizationSuggestions = await analyzer.suggestVisualization(analysis.analysis);

        res.json({
            success: true,
            analysis: analysis.analysis,
            visualization: visualizationSuggestions
        });

    } catch (error) {
        console.error('LLM analysis error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router; 