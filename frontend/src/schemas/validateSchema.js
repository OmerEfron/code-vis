import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import schema from './analysisSchema.json';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const validate = ajv.compile(schema);

export function validateAnalysisResponse(data) {
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