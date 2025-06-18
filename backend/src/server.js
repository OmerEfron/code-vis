const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const llmAnalysisRoutes = require('./routes/llmAnalysisRoutes');
const exampleRoutes = require('./routes/exampleRoutes');
const visualizationRoutes = require('./routes/visualizationRoutes');
const algorithmsRoutes = require('./routes/algorithms');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        error: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply rate limiting to all requests
app.use(limiter);

// Enhanced CORS configuration
const rawAllowedOrigins = process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL || 'http://localhost:3001';
const allowedOriginsSet = new Set(
    rawAllowedOrigins
        .split(',')
        .map(o => o.trim().replace(/\/$/, '')) // trim spaces and trailing slash
        .filter(Boolean)
);
allowedOriginsSet.add('http://localhost:3000'); // for backend testing
allowedOriginsSet.add('http://localhost:3001');

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like curl or mobile apps)
        if (!origin) return callback(null, true);
        const normalizedOrigin = origin.replace(/\/$/, '');
        if (allowedOriginsSet.has(normalizedOrigin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Parse JSON bodies with size limit
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/analyze', llmAnalysisRoutes);
app.use('/api/examples', exampleRoutes);
app.use('/api/visualization', visualizationRoutes);
app.use('/api/algorithms', algorithmsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
        path: req.originalUrl
    });
});

// Enhanced error handling middleware
app.use((err, req, res, next) => {
    // Log error details
    console.error('Error occurred:', {
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString()
    });

    // CORS error handling
    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({
            success: false,
            error: 'CORS policy violation: Origin not allowed'
        });
    }

    // Rate limit error handling
    if (err.status === 429) {
        return res.status(429).json({
            success: false,
            error: 'Too many requests, please try again later'
        });
    }

    // Default error response
    const statusCode = err.status || err.statusCode || 500;
    const errorMessage = process.env.NODE_ENV === 'development' 
        ? err.message 
        : 'Internal server error';

    res.status(statusCode).json({
        success: false,
        error: errorMessage,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

app.listen(port, () => {
    console.log(`Backend server running on port ${port}`);
}); 