'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Stage, Layer, Rect, Text, Group, Arrow, Circle } from 'react-konva';

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
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1000);
    const [dimensions, setDimensions] = useState({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT });

    // Get the selected metaphor and validate data
    const metaphor = data?.metaphors?.[0];
    if (!metaphor || !data.inputs || !data.algorithm) {
        return <div className="p-4 text-gray-600">Loading visualization data...</div>;
    }

    const { steps, elements, visualProperties } = metaphor;

    // Generate visualization states based on metaphor
    const generateStates = useCallback(() => {
        try {
            // Get example array and target value from inputs
            const example = data.inputs.examples[0];
            
            // Parse the input string as a JavaScript object
            // The input is in the format: {a: [1, 3, 5, 7, 9, 11], n: 6, x: 7}
            const inputStr = example.input.trim();
            const evalData = eval('(' + inputStr + ')');
            
            const array = evalData.a;
            const target = evalData.x;

            // Validate array and target
            if (!Array.isArray(array) || target === undefined) {
                console.error('Invalid input format:', example.input);
                return [];
            }
        
            return steps.map((step, index) => ({
                step: index,
                description: step,
                elements: array.map((value, elemIndex) => ({
                    id: elemIndex,
                    value: value,
                    type: Object.keys(elements)[1], // e.g., "Book", "Product", "Song"
                    description: elements[Object.keys(elements)[1]],
                    highlighted: index === elemIndex,
                    checked: index > elemIndex,
                    current: index === elemIndex,
                    found: value === target && index >= elemIndex,
                    isTarget: value === target
                })),
                metrics: {
                    comparisons: index,
                    checked: index,
                    progress: (index / steps.length) * 100,
                    target: target
                }
            }));
        } catch (error) {
            console.error('Error generating states:', error);
            return [];
        }
    }, [data.inputs.examples, steps, elements]);

    const [states, setStates] = useState([]);
    const [currentState, setCurrentState] = useState(null);

    useEffect(() => {
        const newStates = generateStates();
        setStates(newStates);
        setCurrentState(newStates[0]);
    }, [generateStates]);

    useEffect(() => {
        if (states.length > 0) {
            setCurrentState(states[currentStep]);
        }
    }, [currentStep, states]);

    useEffect(() => {
        let interval;
        if (isPlaying && currentStep < states.length - 1) {
            interval = setInterval(() => {
                setCurrentStep(prev => {
                    if (prev < states.length - 1) return prev + 1;
                    setIsPlaying(false);
                    return prev;
                });
            }, playbackSpeed);
        }
        return () => clearInterval(interval);
    }, [isPlaying, currentStep, states.length, playbackSpeed]);

    const getMetaphorColors = () => {
        const { colorScheme } = visualProperties;
        return {
            primary: colorScheme.primary.toLowerCase(),
            secondary: colorScheme.secondary.toLowerCase(),
            highlight: colorScheme.highlight.toLowerCase(),
            background: '#F8F9FA',
            text: '#2C3E50',
            border: '#E1E8ED'
        };
    };

    const renderElement = (element, index, total) => {
        const colors = getMetaphorColors();
        const xPos = (ELEMENT_WIDTH + ELEMENT_MARGIN) * index + ELEMENT_MARGIN;
        const yPos = CANVAS_HEIGHT / 2 - ELEMENT_HEIGHT;

        return (
            <Group key={element.id} x={xPos} y={yPos}>
                <Rect
                    width={ELEMENT_WIDTH}
                    height={ELEMENT_HEIGHT}
                    fill={element.current ? colors.highlight : 
                          element.found ? colors.secondary : 
                          element.checked ? colors.primary : 
                          colors.background}
                    stroke={colors.border}
                    strokeWidth={2}
                    cornerRadius={8}
                    shadowColor="black"
                    shadowBlur={element.highlighted ? 10 : 0}
                    shadowOpacity={0.3}
                />
                <Text
                    text={element.value.toString()}
                    fontSize={20}
                    fill={colors.text}
                    width={ELEMENT_WIDTH}
                    align="center"
                    y={ELEMENT_HEIGHT / 3}
                />
                {element.isTarget && (
                    <Text
                        text="Target"
                        fontSize={12}
                        fill={colors.highlight}
                        width={ELEMENT_WIDTH}
                        align="center"
                        y={ELEMENT_HEIGHT * 2/3}
                    />
                )}
            </Group>
        );
    };

    const renderMetrics = () => {
        if (!currentState) return null;
        const { metrics } = currentState;
        const colors = getMetaphorColors();

        return (
            <Group y={CANVAS_HEIGHT - 100}>
                <Rect
                    width={dimensions.width - 40}
                    height={80}
                    x={20}
                    fill={colors.background}
                    stroke={colors.border}
                    cornerRadius={8}
                />
                <Text
                    text={`Comparisons: ${metrics.comparisons}`}
                    fontSize={16}
                    fill={colors.text}
                    x={40}
                    y={20}
                />
                <Text
                    text={`Elements Checked: ${metrics.checked}`}
                    fontSize={16}
                    fill={colors.text}
                    x={200}
                    y={20}
                />
                <Text
                    text={`Target Value: ${metrics.target}`}
                    fontSize={16}
                    fill={colors.text}
                    x={400}
                    y={20}
                />
                <Text
                    text={`Progress: ${Math.round(metrics.progress)}%`}
                    fontSize={16}
                    fill={colors.text}
                    x={600}
                    y={20}
                />
            </Group>
        );
    };

    if (!currentState) return <div>Loading visualization...</div>;

    const colors = getMetaphorColors();

    return (
        <div className="flex flex-col gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
                <Stage width={dimensions.width} height={dimensions.height}>
                    <Layer>
                        {/* Background */}
                        <Rect
                            width={dimensions.width}
                            height={dimensions.height}
                            fill={colors.background}
                            cornerRadius={8}
                        />
                        
                        {/* Description */}
                        <Text
                            text={currentState.description}
                            fontSize={18}
                            fill={colors.text}
                            width={dimensions.width}
                            align="center"
                            y={30}
                        />
                        
                        {/* Elements */}
                        {currentState.elements.map((element, index) => 
                            renderElement(element, index, currentState.elements.length)
                        )}
                        
                        {/* Metrics */}
                        {renderMetrics()}
                    </Layer>
                </Stage>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
                <button
                    onClick={() => setCurrentStep(0)}
                    className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-lg transition-colors"
                    disabled={currentStep === 0}
                >
                    Reset
                </button>
                <button
                    onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                    className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-lg transition-colors"
                    disabled={currentStep === 0}
                >
                    ← Previous
                </button>
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
                >
                    {isPlaying ? 'Pause' : 'Play'}
                </button>
                <button
                    onClick={() => setCurrentStep(prev => Math.min(states.length - 1, prev + 1))}
                    className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-lg transition-colors"
                    disabled={currentStep === states.length - 1}
                >
                    Next →
                </button>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Speed:</span>
                    <input
                        type="range"
                        min="100"
                        max="2000"
                        step="100"
                        value={playbackSpeed}
                        onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                        className="w-32"
                    />
                </div>
            </div>

            {/* Progress */}
            <div className="bg-white p-4 rounded-lg shadow">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${(currentStep / (states.length - 1)) * 100}%` }}
                    />
                </div>
                <div className="mt-2 text-sm text-gray-600 flex justify-between font-medium">
                    <span>Step {currentStep + 1} of {states.length}</span>
                    <span>{Math.round((currentStep / (states.length - 1)) * 100)}% Complete</span>
                </div>
            </div>
        </div>
    );
};

export default AlgorithmVisualization; 