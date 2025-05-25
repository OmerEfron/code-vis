'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Stage, Layer, Rect, Text, Group, Arrow, Circle } from 'react-konva';
import { VisualizationParser } from '../utils/visualizationParser';
import VisualizationContainer from './animations/VisualizationContainer';
import VisualizationControls from './animations/VisualizationControls';
import ErrorBoundary from './common/ErrorBoundary';

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 600;
const ELEMENT_HEIGHT = 80;
const ELEMENT_WIDTH = 100;
const ELEMENT_MARGIN = 20;
const COLORS = {
    primary: '#4A90E2',
    secondary: '#F5A623',
    highlight: '#7ED321',
    background: '#F8F9FA',
    text: '#2C3E50',
    border: '#E1E8ED',
    success: '#2ECC71',
    current: '#FF6B6B'
};

const AlgorithmVisualization = ({ data }) => {
    const [error, setError] = useState(null);
    const [currentState, setCurrentState] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1000);
    const [states, setStates] = useState([]);
    const [parsedData, setParsedData] = useState(null);

    // Parse and validate data on component mount or when data changes
    useEffect(() => {
        if (!data) return;

        try {
            const parsed = VisualizationParser.validateAndParseData(data);
            setParsedData(parsed);
            setError(null);
        } catch (err) {
            console.error('Visualization data error:', err);
            setError(err.message);
            setParsedData(null);
        }
    }, [data]);

    // Generate states when parsed data changes
    useEffect(() => {
        if (!parsedData) return;
        
        try {
            const newStates = generateStates(parsedData);
            setStates(newStates);
            setCurrentState(0);
            setIsPlaying(false);
        } catch (err) {
            console.error('State generation error:', err);
            setError('Failed to generate visualization states');
        }
    }, [parsedData]);

    // Enhanced state generation using parsed data
    const generateStates = useCallback((parsedData) => {
        const { metaphor, algorithm, inputs } = parsedData;
        const example = inputs.examples[0] || { input: { a: [1, 2, 3, 4, 5], n: 5, x: 3 } };
        const { a: array, n: length, x: target } = example.input;

        const states = [];
        const { visualProperties } = metaphor;
        const steps = metaphor.steps;

        // Initial state
        states.push(createState({
            array,
            target,
            currentIndex: Math.floor(length / 2),
            left: 0,
            right: length - 1,
            found: false,
            stepIndex: 0,
            comparisons: 0,
            arrayAccesses: 0,
            metaphor,
            algorithm
        }));

        // Generate intermediate states
        let left = 0;
        let right = length - 1;
        let comparisons = 0;
        let arrayAccesses = 0;

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            comparisons++;
            arrayAccesses++;

            const stepIndex = Math.min(
                Math.floor((comparisons / length) * steps.length),
                steps.length - 1
            );

            states.push(createState({
                array,
                target,
                currentIndex: mid,
                left,
                right,
                found: array[mid] === target,
                stepIndex,
                comparisons,
                arrayAccesses,
                metaphor,
                algorithm
            }));

            if (array[mid] === target) break;
            if (array[mid] > target) right = mid - 1;
            else left = mid + 1;
        }

        return states;
    }, []);

    // Helper function to create a state object
    const createState = ({
        array,
        target,
        currentIndex,
        left,
        right,
        found,
        stepIndex,
        comparisons,
        arrayAccesses,
        metaphor,
        algorithm
    }) => {
        const { visualProperties } = metaphor;
        
        // Create elements array for visualization
        const elements = array.map((value, index) => ({
            id: `element-${index}`,
            value,
            index,
            current: index === currentIndex,
            isTarget: value === target,
            checked: index < left || index > right,
            highlighted: index >= left && index <= right,
            position: { x: index * 120 + 50, y: 200 }
        }));
        
        return {
            elements, // Add elements array
            array,
            target,
            currentIndex,
            left,
            right,
            found,
            description: metaphor.steps[stepIndex] || getDefaultDescription(array[currentIndex], target, found),
            metrics: {
                currentPhase: getPhase(comparisons, array.length),
                efficiency: {
                    timeComplexity: algorithm.timeComplexity,
                    spaceComplexity: algorithm.spaceComplexity
                },
                comparisons,
                arrayAccesses,
                checked: comparisons,
                progress: ((comparisons / array.length) * 100),
                target,
                currentMemoryUsage: {
                    main: array.length,
                    auxiliary: 3,
                    total: array.length + 3
                }
            },
            style: {
                colors: visualProperties.colorScheme,
                layout: visualProperties.layout,
                primaryElements: visualProperties.primaryElements,
                animations: visualProperties.animations
            }
        };
    };

    const getDefaultDescription = (current, target, found) => {
        if (found) return `Found ${target} at current position!`;
        return current > target 
            ? `${current} is too high, searching left half`
            : `${current} is too low, searching right half`;
    };

    const getPhase = (comparisons, length) => {
        if (comparisons <= length / 3) return 'Initial Search';
        if (comparisons <= length * 2/3) return 'Deep Search';
        return 'Final Check';
    };

    // Playback control
    useEffect(() => {
        let timer;
        if (isPlaying && currentState < states.length - 1) {
            timer = setTimeout(() => {
                setCurrentState(prev => prev + 1);
            }, playbackSpeed);
        } else if (currentState >= states.length - 1) {
            setIsPlaying(false);
        }
        return () => clearTimeout(timer);
    }, [isPlaying, currentState, states.length, playbackSpeed]);

    // Event handlers
    const handlePlay = () => setIsPlaying(!isPlaying);
    const handleReset = () => {
        setCurrentState(0);
        setIsPlaying(false);
    };
    const handleStepForward = () => {
        if (currentState < states.length - 1) {
            setCurrentState(prev => prev + 1);
            setIsPlaying(false);
        }
    };
    const handleStepBack = () => {
        if (currentState > 0) {
            setCurrentState(prev => prev - 1);
            setIsPlaying(false);
        }
    };
    const handleSpeedChange = (speed) => setPlaybackSpeed(speed);

    if (error) {
        return (
            <div className="p-4 border border-red-300 rounded bg-red-50 text-red-700">
                <h3 className="font-bold mb-2">Visualization Error</h3>
                <p>{error}</p>
            </div>
        );
    }

    if (!parsedData || states.length === 0) {
        return (
            <div className="p-4 border border-gray-300 rounded bg-gray-50">
                <p className="text-gray-600">Loading visualization...</p>
            </div>
        );
    }

    const currentStateData = states[currentState];

    return (
        <ErrorBoundary>
            <div className="visualization-container p-4">
                <div className="mb-4">
                    <h2 className="text-xl font-bold mb-2">{parsedData.metaphor.name}</h2>
                    <p className="text-gray-600">{parsedData.metaphor.description}</p>
                </div>

                <VisualizationContainer
                    states={states}
                    currentState={currentState}
                    metaphor={parsedData.metaphor}
                />

                <div className="mt-4 p-4 bg-gray-50 rounded">
                    <p className="mb-2 font-medium">{currentStateData.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p>Comparisons: {currentStateData.metrics.comparisons}</p>
                            <p>Array Accesses: {currentStateData.metrics.arrayAccesses}</p>
                        </div>
                        <div>
                            <p>Time: {currentStateData.metrics.efficiency.timeComplexity}</p>
                            <p>Space: {currentStateData.metrics.efficiency.spaceComplexity}</p>
                        </div>
                    </div>
                </div>

                <VisualizationControls
                    isPlaying={isPlaying}
                    onPlay={handlePlay}
                    onReset={handleReset}
                    onStepForward={handleStepForward}
                    onStepBack={handleStepBack}
                    onSpeedChange={handleSpeedChange}
                    playbackSpeed={playbackSpeed}
                    currentStep={currentState + 1}
                    totalSteps={states.length}
                />
            </div>
        </ErrorBoundary>
    );
};

export default AlgorithmVisualization; 