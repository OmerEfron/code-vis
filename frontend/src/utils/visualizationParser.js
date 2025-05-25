import { validateAnalysisResponse } from '../schemas/validateSchema';

/**
 * Validates and parses input data for visualization
 */
export class VisualizationParser {
  /**
   * Validates the analysis response and extracts visualization data
   * @param {Object} data - The raw analysis response
   * @returns {Object} Parsed and validated visualization data
   * @throws {Error} If validation fails or required data is missing
   */
  static validateAndParseData(data) {
    // First validate against schema
    const validation = validateAnalysisResponse(data);
    if (!validation.valid) {
      throw new Error(`Invalid analysis data: ${JSON.stringify(validation.errors)}`);
    }

    // Ensure we have metaphors
    if (!data.analysis?.metaphors?.length) {
      throw new Error('No metaphors found in analysis data');
    }

    return {
      metaphor: this.parseMetaphor(data.analysis.metaphors[0]),
      algorithm: this.parseAlgorithm(data.analysis.algorithm),
      inputs: this.parseInputs(data.analysis.inputs)
    };
  }

  /**
   * Parses and validates metaphor data
   * @param {Object} metaphor - The metaphor object
   * @returns {Object} Parsed metaphor data
   */
  static parseMetaphor(metaphor) {
    if (!metaphor.visualProperties) {
      throw new Error('Metaphor missing visual properties');
    }

    // Ensure color values are valid CSS colors
    const colorScheme = metaphor.visualProperties.colorScheme || {};
    const defaultColors = {
      primary: '#4A90E2',
      secondary: '#F5A623',
      highlight: '#7ED321'
    };

    return {
      name: metaphor.name,
      description: metaphor.description,
      learningStyle: metaphor.learningStyle,
      steps: Array.isArray(metaphor.steps) ? metaphor.steps : [],
      elements: metaphor.elements || {},
      visualProperties: {
        primaryElements: Array.isArray(metaphor.visualProperties.primaryElements) 
          ? metaphor.visualProperties.primaryElements 
          : [],
        secondaryElements: Array.isArray(metaphor.visualProperties.secondaryElements)
          ? metaphor.visualProperties.secondaryElements
          : [],
        animations: Array.isArray(metaphor.visualProperties.animations)
          ? metaphor.visualProperties.animations
          : ['fade', 'slide'],
        interactiveElements: Array.isArray(metaphor.visualProperties.interactiveElements)
          ? metaphor.visualProperties.interactiveElements
          : [],
        layout: {
          type: metaphor.visualProperties.layout?.type || 'horizontal',
          arrangement: metaphor.visualProperties.layout?.arrangement || 'linear'
        },
        colorScheme: {
          primary: this.validateColor(colorScheme.primary) || defaultColors.primary,
          secondary: this.validateColor(colorScheme.secondary) || defaultColors.secondary,
          highlight: this.validateColor(colorScheme.highlight) || defaultColors.highlight
        }
      }
    };
  }

  /**
   * Parses and validates algorithm data
   * @param {Object} algorithm - The algorithm object
   * @returns {Object} Parsed algorithm data
   */
  static parseAlgorithm(algorithm) {
    return {
      type: algorithm.algorithmType,
      category: algorithm.category,
      timeComplexity: algorithm.timeComplexity,
      spaceComplexity: algorithm.spaceComplexity,
      explanation: algorithm.explanation
    };
  }

  /**
   * Parses and validates input data
   * @param {Object} inputs - The inputs object
   * @returns {Object} Parsed input data
   */
  static parseInputs(inputs) {
    const examples = inputs?.examples || [];
    return {
      examples: examples.map(example => this.parseExample(example))
    };
  }

  /**
   * Parses and validates an example
   * @param {Object} example - The example object
   * @returns {Object} Parsed example data
   */
  static parseExample(example) {
    let input = example.input;
    
    // Handle string inputs that need to be evaluated
    if (typeof input === 'string') {
      try {
        // Safely evaluate the input string
        input = this.safeEval(input);
      } catch (error) {
        console.error('Failed to parse example input:', error);
        // Fallback to a default object structure
        input = { value: input };
      }
    }

    // Return the input as-is since we now support flexible formats
    // No need to force a specific structure like {a, n, x}
    return {
      input: input || {},
      expectedOutput: example.expectedOutput
    };
  }

  /**
   * Safely evaluates a string input
   * @param {string} str - The input string to evaluate
   * @returns {Object} The evaluated object
   */
  static safeEval(str) {
    // Remove any potential harmful content
    str = str.replace(/[^{}\[\],\s\w:.-]/g, '');
    
    try {
      // Try parsing as JSON first
      return JSON.parse(str);
    } catch {
      try {
        // If JSON parse fails, try evaluating as object notation
        // This is safe because we've already removed potentially harmful content
        return eval(str);
      } catch {
        throw new Error('Failed to parse input string');
      }
    }
  }

  /**
   * Validates a CSS color value
   * @param {string} color - The color value to validate
   * @returns {string|null} The validated color or null if invalid
   */
  static validateColor(color) {
    if (!color) return null;
    
    // Test if it's a valid hex color
    if (/^#[0-9A-F]{6}$/i.test(color)) return color;
    
    // Test if it's a valid RGB/RGBA color
    if (/^rgba?\([\d\s,%.]+\)$/.test(color)) return color;
    
    // Test if it's a valid named color
    const testElement = document.createElement('div');
    testElement.style.color = color;
    if (testElement.style.color) return color;
    
    return null;
  }
} 