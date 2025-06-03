'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './debug.module.css';
// import { analyzeCode } from '@/api/axios'; // analyzeCode is for regular analysis, not debug trace
import DebugTraceVisualization from '@/components/DebugTraceVisualization'; // Import the new component

export default function DebugVisualization() {
    const [code, setCode] = useState('');
    const [debugData, setDebugData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleAnalyze = async () => {
        try {
            setLoading(true);
            setError(null);
            setDebugData(null); // Clear previous data

            const response = await fetch('/api/debug/trace', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code }),
            });

            // Check if the response is OK (status 200-299)
            if (!response.ok) {
                const errorBody = await response.text(); // Read response body as text for error details
                console.error('Backend error response:', response.status, response.statusText, errorBody);
                throw new Error(`Backend error: ${response.status} ${response.statusText} - ${errorBody.substring(0, 100)}...`); // Show status and partial body
            }

            // Check if the response is JSON before parsing
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const textBody = await response.text(); // Read response body as text
                console.error('Received non-JSON response:', textBody);
                throw new Error(`Expected JSON response, but received ${contentType || 'unknown content type'}. Response body: ${textBody.substring(0, 200)}...`); // Show content type and partial body
            }

            const data = await response.json();

            // The backend now returns { success, language, consoleOutput, error, simulatedTrace }
            // We check data.success first for API-level errors (e.g., backend crashed, or LLM not initialized)
            if (!data.success) {
                const errorMessage = typeof data.error === 'object' ? 
                    (data.error.message || JSON.stringify(data.error)) : 
                    (data.error || 'Failed to process debug trace request');
                setError(errorMessage);
                setDebugData(null); // Ensure debugData is null on backend API error
            } else {
                // Backend endpoint was reached successfully, now check for execution/simulation errors
                if (data.error) {
                    // Execution/simulation had an error, display the error message from the backend response
                    const executionErrorMessage = typeof data.error === 'object' ?
                        (data.error.message || JSON.stringify(data.error)) :
                        (data.error || 'Code execution/simulation error');
                    setError(executionErrorMessage);
                    setDebugData(data); // Still set debugData to show console output or partial trace if available
                } else {
                    // Success and no execution/simulation error
                    setDebugData(data);
                    setError(null); // Clear any previous error message
                }
            }

        } catch (err) {
            // Network or other frontend error during the fetch call
            setError(err.message || 'An unknown error occurred.');
            setDebugData(null);
        } finally {
            setLoading(false);
        }
    };

    const renderDebugOutput = () => {
        if (!debugData) return null;

        // If we have VM execution results (JavaScript)
        // This is indicated by the presence of consoleOutput and the absence of simulatedTrace
        // Note: JS execution errors are now handled by the main error block below the editor
        if (debugData.language === 'javascript' && debugData.consoleOutput && !debugData.analysis?.simulatedTrace) {
            return (
                <div className={styles.visualization}>
                    <h2>JavaScript Execution Results</h2>
                    {debugData.consoleOutput.length > 0 && (
                        <div className={styles.consoleOutput}>
                            <h3>Console Output:</h3>
                            {debugData.consoleOutput.map((output, index) => (
                                <div key={index} className={styles.consoleLine}>
                                    {output}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        // If we have a simulated trace from LLM (for non-JS or detailed JS simulation)
        // This is indicated by the presence of simulatedTrace
        if (debugData.analysis?.simulatedTrace) {
            // Use the new visual component for simulated trace
            return (
                <DebugTraceVisualization 
                    code={code} // Pass the original code for potential highlighting
                    simulatedTrace={debugData.analysis.simulatedTrace} 
                />
            );
        }

        // Default display if no specific output type is recognized (e.g., empty success response with no trace/output)
        return (
            <div className={styles.visualization}>
                <h2>Debug Results</h2>
                <p>No specific trace or output available, but analysis was successful.</p>
                {/* Optionally display the raw data for debugging */}
                {/* <pre>{JSON.stringify(debugData, null, 2)}</pre> */}
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Debug Visualization</h1>
                <button 
                    className={styles.switchButton}
                    onClick={() => router.push('/')}
                >
                    Switch to Regular Visualization
                </button>
            </div>

            <div className={styles.editor}>
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter your code here..."
                    className={styles.codeInput}
                />
                <button 
                    onClick={handleAnalyze}
                    disabled={loading || !code}
                    className={styles.analyzeButton}
                >
                    {loading ? 'Analyzing...' : 'Analyze Code'}
                </button>
            </div>

            {error && (
                <div className={styles.error}>
                    {error}
                </div>
            )}

            {renderDebugOutput()}
        </div>
    );
} 