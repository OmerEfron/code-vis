require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const visualizationRoutes = require('./routes/visualizationRoutes');
const llmAnalysisRoutes = require('./routes/llmAnalysisRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/visualizations', visualizationRoutes);
app.use('/api/llm', llmAnalysisRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Something went wrong!'
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 