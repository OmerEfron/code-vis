const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const fs = require('fs');
const path = require('path');

// Initialize AJV with formats
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

// Load API schemas
const schemasPath = path.join(__dirname, '../../../schemas/api.json');
const schemas = JSON.parse(fs.readFileSync(schemasPath, 'utf8'));

// Compile schemas
const validators = {
    analysisRequest: ajv.compile(schemas.analysisRequest),
    visualizationRequest: ajv.compile(schemas.visualizationRequest)
};

// Response formatter for validation errors
const ResponseFormatter = {
    error: (message, details = null) => ({
        success: false,
        error: message,
        details,
        meta: {
            timestamp: new Date().toISOString()
        }
    })
};

// Validation middleware factory
const validateRequest = (schemaName) => {
    return (req, res, next) => {
        const validator = validators[schemaName];
        
        if (!validator) {
            return res.status(500).json(
                ResponseFormatter.error(`Unknown validation schema: ${schemaName}`)
            );
        }

        const isValid = validator(req.body);
        
        if (!isValid) {
            const errors = validator.errors.map(error => ({
                field: error.instancePath || error.schemaPath,
                message: error.message,
                value: error.data
            }));

            return res.status(400).json(
                ResponseFormatter.error(
                    'Request validation failed',
                    {
                        validationErrors: errors,
                        receivedData: req.body
                    }
                )
            );
        }

        next();
    };
};

// Specific validation middleware for common endpoints
const validateAnalysisRequest = validateRequest('analysisRequest');
const validateVisualizationRequest = validateRequest('visualizationRequest');

// Input sanitization middleware
const sanitizeCode = (req, res, next) => {
    if (req.body.code) {
        // Remove potentially dangerous patterns
        const dangerousPatterns = [
            /require\s*\(\s*['"`]fs['"`]\s*\)/gi,
            /require\s*\(\s*['"`]child_process['"`]\s*\)/gi,
            /import.*from\s*['"`]fs['"`]/gi,
            /eval\s*\(/gi,
            /Function\s*\(/gi,
            /process\./gi,
            /__dirname/gi,
            /__filename/gi
        ];
        
        let sanitizedCode = req.body.code;
        dangerousPatterns.forEach(pattern => {
            sanitizedCode = sanitizedCode.replace(pattern, '/* REMOVED_UNSAFE_CODE */');
        });
        
        // Limit code length
        if (sanitizedCode.length > 10000) {
            return res.status(400).json(
                ResponseFormatter.error('Code exceeds maximum length of 10,000 characters')
            );
        }
        
        req.body.code = sanitizedCode;
    }
    
    next();
};

// Rate limiting for specific endpoints
const createEndpointLimiter = (windowMs, max, message) => {
    const rateLimit = require('express-rate-limit');
    
    return rateLimit({
        windowMs,
        max,
        message: ResponseFormatter.error(message),
        standardHeaders: true,
        legacyHeaders: false,
        keyGenerator: (req) => {
            // Use IP + endpoint for more granular limiting
            return `${req.ip}:${req.path}`;
        }
    });
};

// Specific rate limiters
const analysisLimiter = createEndpointLimiter(
    15 * 60 * 1000, // 15 minutes
    10, // 10 requests per window
    'Too many analysis requests. Please wait before trying again.'
);

const visualizationLimiter = createEndpointLimiter(
    5 * 60 * 1000, // 5 minutes
    20, // 20 requests per window
    'Too many visualization requests. Please wait before trying again.'
);

module.exports = {
    validateRequest,
    validateAnalysisRequest,
    validateVisualizationRequest,
    sanitizeCode,
    analysisLimiter,
    visualizationLimiter,
    ResponseFormatter
}; 