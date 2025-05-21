const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const schema = require('./analysisSchema.json');

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const validate = ajv.compile(schema);

/**
 * Validates an analysis response against the schema
 * @param {Object} data - The data to validate
 * @returns {Object} Validation result with valid flag and any errors
 */
function validateAnalysisResponse(data) {
  const valid = validate(data);
  if (!valid) {
    const errors = validate.errors.map(error => ({
      path: error.instancePath,
      message: error.message,
      params: error.params
    }));
    return {
      valid: false,
      errors
    };
  }
  return {
    valid: true,
    errors: []
  };
}

module.exports = {
  validateAnalysisResponse
}; 