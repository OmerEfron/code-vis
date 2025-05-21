const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const llmAnalysisRoutes = require('./routes/llmAnalysisRoutes');
const exampleRoutes = require('./routes/exampleRoutes');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: 'http://localhost:3001', // Allow frontend on port 3001
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// Parse JSON bodies
app.use(bodyParser.json());

// Routes
app.use('/api/analyze', llmAnalysisRoutes);
app.use('/api/examples', exampleRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, error: 'Something went wrong!' });
});

app.listen(port, () => {
    console.log(`Backend server running on port ${port}`);
}); 