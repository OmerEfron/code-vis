import React, { useState, useEffect } from 'react';
import { Stage, Layer, Circle, Text, Arrow } from 'react-konva';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
// Import any necessary styling or UI components
// import styles from './DebugTraceVisualization.module.css'; // Example styling

// Helper function to detect language from code
const detectLanguage = (code) => {
    if (code.includes('#include') || code.includes('int main') || code.includes('cout <<')) return 'cpp';
    if (code.includes('System.out.println') || code.includes('public static void main')) return 'java';
    if (code.includes('print(') || code.includes('def ')) return 'python';
    return 'javascript';
};

const DebugTraceVisualization = ({ code, simulatedTrace }) => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [codeLines, setCodeLines] = useState([]);
    const detectedLanguage = detectLanguage(code);

    // Find the first step with an error
    const firstErrorStep = simulatedTrace?.steps?.findIndex(step => step.isPotentialError) ?? -1;

    useEffect(() => {
        setCodeLines(code.split('\n'));
        // If there's an error, jump to the first error step
        if (firstErrorStep !== -1) {
            setCurrentStepIndex(firstErrorStep);
        }
    }, [code, firstErrorStep]);

    if (!simulatedTrace || !simulatedTrace.steps || codeLines.length === 0) {
        return <div>No trace data available or code not loaded.</div>;
    }

    const steps = simulatedTrace.steps;
    const currentStep = steps[currentStepIndex];

    // Define dimensions and spacing
    const containerWidth = '100%';
    const visualizationWidth = 600;
    const codePanelWidth = 500;
    const stageHeight = 400;
    const nodeSpacing = 100;
    const startX = 50;
    const startY = stageHeight / 3;
    const nodeRadius = 25;

    // Calculate node positions and arrow points
    const nodes = steps.map((step, index) => {
        const x = startX + index * nodeSpacing;
        const y = startY;
        const isCurrent = index === currentStepIndex;

        const nextNode = steps[index + 1];
        const arrowPoints = nextNode ? [
            x + nodeRadius, y,
            x + nodeSpacing - nodeRadius, y
        ] : [];

        return {
            x,
            y,
            step,
            index,
            isCurrent,
            arrowPoints,
        };
    });

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: '20px',
            padding: '20px',
            maxWidth: '1200px',
            margin: '0 auto'
        }}>
            {/* Error banner if there's an error */}
            {firstErrorStep !== -1 && (
                <div style={{
                    backgroundColor: '#ffebee',
                    padding: '15px',
                    borderRadius: '8px',
                    borderLeft: '4px solid #f44336',
                    marginBottom: '10px'
                }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#d32f2f' }}>
                        ⚠️ Error Detected
                    </h3>
                    <p style={{ margin: 0, color: '#d32f2f' }}>
                        {simulatedTrace.steps[firstErrorStep].errorMessage}
                    </p>
                </div>
            )}

            {/* Main content area */}
            <div style={{ 
                display: 'flex', 
                gap: '20px',
                alignItems: 'flex-start'
            }}>
                {/* Visualization panel */}
                <div style={{ 
                    flex: '1',
                    backgroundColor: '#f5f5f5',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{ marginTop: 0, color: '#333' }}>Debug Trace</h2>
                    <Stage width={visualizationWidth} height={stageHeight}>
                        <Layer>
                            {nodes.map(node => node.arrowPoints.length > 0 && (
                                <Arrow
                                    key={`arrow-${node.index}`}
                                    points={node.arrowPoints}
                                    pointerLength={10}
                                    pointerWidth={10}
                                    fill={node.step.isPotentialError ? '#f44336' : '#666'}
                                    stroke={node.step.isPotentialError ? '#f44336' : '#666'}
                                    strokeWidth={2}
                                />
                            ))}

                            {nodes.map(node => (
                                <React.Fragment key={node.index}>
                                    <Circle
                                        x={node.x}
                                        y={node.y}
                                        radius={nodeRadius}
                                        fill={node.step.isPotentialError ? '#f44336' : (node.isCurrent ? '#2196f3' : '#9e9e9e')}
                                        stroke={node.step.isPotentialError ? '#d32f2f' : '#333'}
                                        strokeWidth={node.step.isPotentialError ? 2 : (node.isCurrent ? 2 : 1)}
                                    />
                                    <Text
                                        x={node.x - (node.index + 1).toString().length * 3.5}
                                        y={node.y - 12}
                                        text={`${node.index + 1}`}
                                        fontSize={12}
                                        fill='white'
                                        align='center'
                                        verticalAlign='middle'
                                    />
                                    <Text
                                        x={node.x - (node.step.lineNumber).toString().length * 4}
                                        y={node.y + 2}
                                        text={`Line ${node.step.lineNumber}`}
                                        fontSize={10}
                                        fill={node.step.isPotentialError ? '#d32f2f' : '#333'}
                                        align='center'
                                        verticalAlign='middle'
                                    />
                                </React.Fragment>
                            ))}
                        </Layer>
                    </Stage>
                </div>

                {/* Code panel */}
                <div style={{ 
                    flex: '1',
                    backgroundColor: '#1e1e1e',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{ 
                        margin: '0',
                        padding: '15px',
                        color: '#fff',
                        backgroundColor: '#252526',
                        borderBottom: '1px solid #333'
                    }}>Code</h2>
                    <div style={{ position: 'relative' }}>
                        <SyntaxHighlighter
                            language={detectedLanguage}
                            style={vscDarkPlus}
                            customStyle={{
                                margin: 0,
                                padding: '15px',
                                fontSize: '14px',
                                lineHeight: '1.5'
                            }}
                            showLineNumbers={true}
                            wrapLines={true}
                            lineProps={lineNumber => {
                                const style = { display: 'block' };
                                if (lineNumber === currentStep.lineNumber) {
                                    if (currentStep.isPotentialError) {
                                        style.backgroundColor = 'rgba(244, 67, 54, 0.2)';
                                        style.borderLeft = '3px solid #f44336';
                                    } else {
                                        style.backgroundColor = 'rgba(33, 150, 243, 0.2)';
                                        style.borderLeft = '3px solid #2196f3';
                                    }
                                }
                                return { style };
                            }}
                        >
                            {code}
                        </SyntaxHighlighter>
                    </div>
                </div>
            </div>

            {/* Information panel */}
            <div style={{ 
                backgroundColor: '#fff',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <div style={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '15px'
                }}>
                    <h3 style={{ margin: 0, color: '#333' }}>
                        Step {currentStepIndex + 1}/{steps.length} (Line {currentStep.lineNumber})
                    </h3>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                            onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
                            disabled={currentStepIndex === 0}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: currentStepIndex === 0 ? '#e0e0e0' : '#2196f3',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: currentStepIndex === 0 ? 'not-allowed' : 'pointer'
                            }}
                        >
                            Previous
                        </button>
                        <button 
                            onClick={() => setCurrentStepIndex(prev => Math.min(steps.length - 1, prev + 1))}
                            disabled={currentStepIndex === steps.length - 1}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: currentStepIndex === steps.length - 1 ? '#e0e0e0' : '#2196f3',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: currentStepIndex === steps.length - 1 ? 'not-allowed' : 'pointer'
                            }}
                        >
                            Next
                        </button>
                        {firstErrorStep !== -1 && (
                            <button 
                                onClick={() => setCurrentStepIndex(firstErrorStep)}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#f44336',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Jump to Error
                            </button>
                        )}
                    </div>
                </div>

                <div style={{ 
                    backgroundColor: currentStep.isPotentialError ? '#ffebee' : '#f5f5f5',
                    padding: '15px',
                    borderRadius: '4px',
                    marginBottom: '15px',
                    borderLeft: currentStep.isPotentialError ? '4px solid #f44336' : 'none'
                }}>
                    <p style={{ 
                        margin: 0,
                        color: currentStep.isPotentialError ? '#d32f2f' : '#333'
                    }}>
                        {currentStep.explanation}
                    </p>
                </div>

                {currentStep.variables && Object.keys(currentStep.variables).length > 0 && (
                    <div style={{ marginBottom: '15px' }}>
                        <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Variables:</h4>
                        <div style={{ 
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                            gap: '10px'
                        }}>
                            {Object.entries(currentStep.variables).map(([key, value]) => (
                                <div key={key} style={{
                                    backgroundColor: '#f5f5f5',
                                    padding: '10px',
                                    borderRadius: '4px'
                                }}>
                                    <strong style={{ color: '#2196f3' }}>{key}:</strong>
                                    <span style={{ marginLeft: '5px' }}>{JSON.stringify(value)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {currentStep.isPotentialError && (
                    <div style={{
                        backgroundColor: '#ffebee',
                        padding: '15px',
                        borderRadius: '4px',
                        borderLeft: '4px solid #f44336'
                    }}>
                        <h4 style={{ margin: '0 0 10px 0', color: '#d32f2f' }}>Error Details:</h4>
                        <p style={{ margin: 0, color: '#d32f2f' }}>{currentStep.errorMessage}</p>
                    </div>
                )}

                {simulatedTrace.finalState && Object.keys(simulatedTrace.finalState).length > 0 && currentStepIndex === steps.length - 1 && (
                    <div style={{ marginTop: '15px' }}>
                        <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Final State:</h4>
                        <div style={{ 
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                            gap: '10px'
                        }}>
                            {Object.entries(simulatedTrace.finalState).map(([key, value]) => (
                                <div key={key} style={{
                                    backgroundColor: '#e8f5e9',
                                    padding: '10px',
                                    borderRadius: '4px'
                                }}>
                                    <strong style={{ color: '#2e7d32' }}>{key}:</strong>
                                    <span style={{ marginLeft: '5px' }}>{JSON.stringify(value)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DebugTraceVisualization; 