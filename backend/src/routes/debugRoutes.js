const express = require('express');
const router = express.Router();
const { VM } = require('vm2'); // Import VM
const LLMFactory = require('../services/llm/factory'); // Import LLM factory
const schema = require('../schemas/analysisSchema.json'); // Import schema
const { validateAnalysisResponse } = require('../schemas/validateSchema'); // Import validation

// Initialize the analyzer (reusing the LLM analyzer)
let analyzer = null;

// Middleware to ensure analyzer is initialized
const ensureAnalyzer = async (req, res, next) => {
    if (!analyzer) {
        try {
            analyzer = LLMFactory.createAnalyzer();
            await analyzer.initialize();
        } catch (error) {
            console.error('Failed to initialize LLM analyzer:', error);
            // Allow endpoint to proceed without LLM if it's JS execution
        }
    }
    next();
};

// Helper to detect code language (improved)
const detectLanguage = (code) => {
    // Improved detection based on common syntax patterns
    if (code.includes('#include') || code.includes('int main') || code.includes('cout <<') || code.includes('void ') || code.includes('int ') || code.includes('char ') || code.includes('float ') || code.includes('double ') || code.includes('std::')) return 'cpp';
    if (code.includes('System.out.println') || code.includes('public static void main') || code.includes('class ') || code.includes('import java')) return 'java';
    if (code.includes('print(') || code.includes('def ') || code.includes('import ') || code.includes('class ')) return 'python';
    // Default to javascript if no clear pattern is found
    return 'javascript';
};

// Helper function to recursively sanitize data for JSON serialization
const sanitizeForJson = (data) => {
    if (data === null || typeof data !== 'object') {
        // Primitive types or null are fine
        return data;
    }

    if (Array.isArray(data)) {
        // Sanitize array elements
        return data.map(item => sanitizeForJson(item));
    }

    // Sanitize object properties
    const sanitizedObject = {};
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            const value = data[key];
             if (value !== undefined) { // Treat undefined as null for JSON
                 sanitizedObject[key] = sanitizeForJson(value);
             } else {
                 sanitizedObject[key] = null;
             }
        }
    }
    return sanitizedObject;
};

// Endpoint for code tracing (now handles multiple languages via VM or LLM simulation)
router.post('/trace', ensureAnalyzer, async (req, res) => {
    console.log('=== Debug Trace Request Started ===');
    const { code } = req.body;
    console.log('Request body:', { codeLength: code?.length });

    if (!code) {
        console.log('No code provided in request');
        return res.status(400).json({
            success: false,
            error: 'No code provided for tracing',
            analysis: null,
            consoleOutput: []
        });
    }

    const language = detectLanguage(code);
    console.log('Detected language:', language);

    let analysisResult = null; // Will hold the structured analysis (like simulatedTrace)
    let success = false; // Overall success status of the API request
    let primaryError = null; // Top-level error for the API request

    try {
        console.log('Starting execution path...');
        if (language === 'javascript') {
            console.log('Using VM2 for JavaScript execution');
            let consoleOutput = [];
            let executionError = null;
            let executionTrace = { // Structure matches simulatedTrace schema
                steps: [],
                finalState: {},
                finalError: null // Error *within* the JS execution
            };

            try {
                console.log('Creating VM2 instance...');
                const vm = new VM({
                    timeout: 5000,
                    sandbox: {
                        console: {
                            log: (...args) => {
                                const output = args.map(String).join(' ');
                                console.log('VM Console output:', output);
                                consoleOutput.push(output);
                                // Add console output as a step in the trace
                                executionTrace.steps.push({
                                    lineNumber: 0, // VM2 doesn't give line numbers easily
                                    explanation: `Console output: ${output}`,
                                    variables: {}, // VM2 doesn't give variable state easily
                                    isPotentialError: false
                                });
                            }
                        },
                        // Simple error tracking in VM2
                        Error: class extends Error {
                            constructor(message, stack) {
                                super(message);
                                this.stack = stack || (new Error()).stack;
                                console.log('VM Error created:', message);
                                executionTrace.steps.push({
                                    lineNumber: 0, // Again, no easy line number
                                    explanation: `Error: ${message}`,
                                    variables: {},
                                    isPotentialError: true,
                                    errorMessage: message
                                });
                                // Store the first error encountered as finalError
                                if (!executionTrace.finalError) {
                                     executionTrace.finalError = {
                                         type: this.name,
                                         message: this.message,
                                         stack: this.stack // May not be accurate within VM2
                                     };
                                }
                            }
                        }
                    }
                });

                console.log('Wrapping code for execution...');
                const wrappedCode = `
                    try {
                        ${code}
                    } catch (error) {
                        console.error('Error caught in VM:', error.message);
                        // Ensure error is added to trace and finalError is set
                         if (executionTrace.steps.findIndex(step => step.errorMessage === error.message) === -1) {
                             executionTrace.steps.push({
                                 lineNumber: 0,
                                 explanation: \`Error caught: \${error.message}\`,
                                 variables: {},
                                 isPotentialError: true,
                                 errorMessage: error.message
                             });
                         }
                         if (!executionTrace.finalError) {
                             executionTrace.finalError = {
                                 type: error.name,
                                 message: error.message,
                                 stack: error.stack
                             };
                         }
                        // Re-throw to be caught by the outer try-catch for the VM run
                        throw error;
                    }
                `;

                console.log('Executing code in VM...');
                vm.run(wrappedCode);
                console.log('VM2 execution completed successfully');
                success = true; // VM execution itself didn't crash the backend
                analysisResult = { // Structure matches the 'analysis' property in the schema
                     simulatedTrace: executionTrace
                     // Other analysis fields would go here if VM2 provided them
                };
                primaryError = executionTrace.finalError; // Use error from trace if present

            } catch (error) {
                // Catch errors from vm.run() itself
                console.error('Error during VM2 execution (caught by outer handler):', error);
                 success = false; // VM execution failed
                 primaryError = {
                     type: error.name,
                     message: error.message,
                     stack: error.stack
                 };
                 analysisResult = { // Still return analysis structure, but trace might be incomplete
                     simulatedTrace: executionTrace || { steps: [], finalState: {}, finalError: primaryError }
                 };
            }

        } else { // Handle other languages via LLM simulation
            console.log('Using LLM for non-JavaScript execution');
            if (!analyzer) {
                 primaryError = 'LLM provider not initialized, cannot simulate trace for this language.';
                 console.error(primaryError);
                 // Send a 503 service unavailable if LLM is required but not initialized
                 return res.status(503).json({
                    success: false,
                    error: primaryError,
                    analysis: null,
                    consoleOutput: []
                 });
            }

            try {
                console.log('Preparing LLM prompt...');
                const prompt = `
You are a code analysis expert tasked with simulating the step-by-step execution of code and identifying potential errors in real-time. Your analysis must strictly follow the provided JSON schema format, specifically focusing on the 'simulatedTrace' object.

Task:
1. Read the provided code carefully, understanding its logic and flow for ${language}.
2. Simulate the execution of the code line by line, step by step, EXACTLY as a debugger would, from start to FINISH.
3. For each line of code:
   - Identify the exact line number
   - Describe what the code is doing
   - Track all variable changes
   - Check for potential errors that could occur at this exact point
4. For each step, you must:
   - Record the current line number
   - Explain what the code is doing at this point
   - Show the current state of ALL variables
   - If there's a potential error, mark it immediately and explain why
5. Types of errors to look for:
   - Runtime errors (e.g., division by zero, null pointer dereference)
   - Type errors (e.g., trying to use a string as a number)
   - Logic errors (e.g., infinite loops, incorrect conditions)
   - Memory issues (e.g., array out of bounds, stack overflow)
   - Language-specific errors (e.g., Python indentation, C++ memory leaks)
6. When you find an error:
   - Mark 'isPotentialError' as true
   - Provide a clear 'errorMessage' explaining the issue
   - Include the exact line number where the error occurs
   - Stop the simulation at that point
7. If no errors are found, continue simulating UNTIL THE VERY LAST LINE of the code is executed.
8. Provide the final state of all variables after the simulation is complete (or at the point of error).

Important Requirements:
- The response MUST be valid JSON and contain ONLY the 'simulatedTrace' object matching the schema exactly.
- Each step MUST include the exact line number from the original code.
- Variables MUST be tracked and updated at EVERY step.
- Errors MUST be detected and reported as soon as they could occur.
- The simulation should be as detailed as possible, showing every significant operation.
- Do NOT include any other analysis or text outside the specified JSON. ONLY provide the JSON. NOTHING ELSE.
- ENSURE THE SIMULATION IS COMPLETE AND COVERS THE ENTIRE EXECUTION FLOW unless an error is encountered.

Schema for simulatedTrace object:
${JSON.stringify(schema.properties.analysis.properties.simulatedTrace, null, 2)}

Code to simulate tracing for (in ${language}):
\`\`\`${language}\n${code}\n\`\`\`

Return ONLY the JSON for the 'simulatedTrace' object as defined in the schema, and ensure the simulation is complete. ABSOLUTELY NO ADDITIONAL TEXT OR EXPLANATION OUTSIDE THE JSON.`;

                console.log('Sending code to LLM for analysis...');
                // analyzer.analyze returns a parsed object or throws
                const llmResponse = await analyzer.analyze(prompt);
                console.log('LLM analysis completed.');

                // === START: Check LLM Response Type and Structure ===
                if (llmResponse && typeof llmResponse === 'object') {
                    // Case 1: LLM returned the simulatedTrace object directly (expected format)
                    if (Array.isArray(llmResponse.steps) && llmResponse.finalState) { // Basic check for trace structure
                         console.log('LLM response format: Appears to be simulatedTrace object.');
                         // Sanitize the raw LLM object before using it
                         analysisResult = { // Structure matches the 'analysis' property in the schema
                            simulatedTrace: sanitizeForJson(llmResponse)
                            // Other analysis fields would go here if LLM provided them
                         };
                         // Determine success based on whether the *trace itself* indicates an error
                         const hasErrorInTrace = analysisResult.simulatedTrace.finalError !== null || (Array.isArray(analysisResult.simulatedTrace.steps) && analysisResult.simulatedTrace.steps.some(step => step.isPotentialError));
                         success = true; // API request was successful because we obtained analysis data (the trace)
                         primaryError = null; // No backend processing error if we successfully got a trace

                    } else if (llmResponse.type === 'object' && llmResponse.properties && llmResponse.required) {
                         // Case 2: LLM returned the schema definition instead of trace data
                         console.error('LLM returned schema definition instead of trace data.', llmResponse);
                         success = false;
                         primaryError = { message: 'LLM failed to generate trace data', details: 'The language model returned the schema definition instead of the actual trace.' };
                         analysisResult = null; // No analysis was generated

                    } else if (llmResponse.error) {
                         // Case 3: LLM returned an object indicating an LLM-level error
                         console.error('LLM returned an error object:', llmResponse);
                         success = false;
                         primaryError = { message: 'LLM processing error', details: llmResponse.error };
                         analysisResult = null;

                    } else {
                         // Case 4: Unexpected object structure from LLM
                         console.error('Unexpected LLM object format:', llmResponse);
                         success = false;
                         primaryError = { message: 'Unexpected object structure from LLM', details: llmResponse };
                         analysisResult = null;
                    }
                } else if (typeof llmResponse === 'string') {
                     // This case should theoretically be caught by the analyzer throwing,
                     // but include as a fallback.
                     console.error('LLM provider returned raw string:', llmResponse);
                     success = false;
                     primaryError = { message: 'LLM provider returned raw string', details: llmResponse };
                     analysisResult = null;

                } else {
                    // Case 6: Truly unexpected response type from analyzer
                    console.error('Analyzer returned unexpected non-object type:', typeof llmResponse);
                    success = false;
                    primaryError = { message: 'Analyzer returned unexpected type', details: `Expected object, received ${typeof llmResponse}` };
                    analysisResult = null;
                }
                // === END: Check LLM Response Type and Structure ===

            } catch (llmError) {
                // Catch errors thrown by analyzer.analyze (e.g., invalid JSON from provider)
                console.error('Error during LLM analysis or provider communication:', llmError);
                 success = false; // LLM analysis failed
                 primaryError = {
                     type: llmError.name,
                     message: llmError.message,
                     stack: llmError.stack
                 };
                 analysisResult = null; // No analysis could be generated
            }
        }

        // Construct the final executionResult to send to the frontend
        // This structure is consistent for both JS (VM2) and LLM paths
        const executionResult = {
            success: success, // Overall API success (did we get analysis data?)
            language: language,
            analysis: analysisResult, // Will be null if analysis failed
            error: primaryError, // Error related to the API request or code execution
            consoleOutput: language === 'javascript' ? analysisResult?.simulatedTrace?.consoleOutput || [] : [], // Only capture console for JS
        };

        // === START: Detailed Logging of final executionResult ===
        console.log('Sending final executionResult to client:');
        try {
            // Log the FINAL structure being sent, including the full analysis/trace data
             console.log(JSON.stringify(executionResult, (key, value) => {
                // Custom replacer to handle large/complex objects like 'steps' in trace
                if (key === 'steps' && Array.isArray(value)) {
                    return `[Array with ${value.length} steps]`; // Summarize steps array
                }
                if (value && typeof value === 'object' && Object.keys(value).length > 10 && key !== 'error' && key !== 'finalError' && key !== 'details') {
                     // Summarize other potentially large objects
                     return `{Object with ${Object.keys(value).length} keys}`;
                }
                return value;
            }, 2));
             // Log the estimated full size if trace data is present
             if (analysisResult?.simulatedTrace) {
                const traceSize = JSON.stringify(analysisResult.simulatedTrace).length;
                console.log(`Simulated trace estimated size (after processing): ${traceSize} characters`);
            }


        } catch (jsonError) {
            console.error('Failed to stringify final executionResult for logging:', jsonError);
             console.log(executionResult); // Log the object directly if stringify fails
        }
        console.log('=== END: Detailed Logging of final executionResult ===');


        res.json(executionResult);

    } catch (error) {
        // This is the top-level catch for any unexpected errors in the route handler itself
        console.error('=== Debug Trace Endpoint Unexpected Error ===');
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        console.error('Request body:', req.body);
        console.error('=== End Error Details ===');

        // Return a generic 500 internal server error for uncaught exceptions
        res.status(500).json({
            success: false,
            error: 'Failed to process debug trace request due to unexpected server error.',
            details: error.message,
            analysis: null,
            consoleOutput: []
        });
    }
});

module.exports = router; 