'use client';

import { useState, useEffect } from 'react';
import { Stage, Layer, Rect, Text, Arrow, Group, Line } from 'react-konva';

export default function AlgorithmVisualization({ data }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [currentState, setCurrentState] = useState(data.states[0]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1000);

    // Canvas dimensions and layout constants
    const CANVAS_WIDTH = 1000;
    const CANVAS_HEIGHT = 700;
    const PAPER_WIDTH = 60;
    const PAPER_HEIGHT = 80;
    const PAPER_SPACING = 20;
    const LEVEL_HEIGHT = 120;
    const BASE_Y = 100;
    const LEFT_MARGIN = 50;

    const COLORS = {
        primary: '#3b82f6', // Bright blue
        secondary: '#6366f1', // Indigo
        success: '#10b981', // Emerald
        warning: '#f59e0b', // Amber
        highlight: {
            bg: '#fef3c7',
            border: '#d97706',
            text: '#92400e'
        },
        paper: {
            default: {
                bg: '#ffffff',
                border: '#94a3b8',
                text: '#1f2937'
            },
            shadow: '#9ca3af'
        },
        pile: {
            bg: '#f8fafc',
            border: '#cbd5e1'
        },
        text: {
            primary: '#1f2937',
            secondary: '#64748b',
            light: '#94a3b8'
        }
    };

    // Calculate paper positions when null
    const calculatePaperPosition = (paper, index, totalPapers) => {
        if (paper.position.x !== null && paper.position.y !== null) {
            return paper.position;
        }

        // Calculate evenly distributed positions
        const totalWidth = totalPapers * (PAPER_WIDTH + PAPER_SPACING);
        const startX = (CANVAS_WIDTH - totalWidth) / 2;
        return {
            x: startX + index * (PAPER_WIDTH + PAPER_SPACING),
            y: paper.position.y || BASE_Y
        };
    };

    useEffect(() => {
        setCurrentState(data.states[currentStep]);
    }, [currentStep, data]);

    useEffect(() => {
        let interval;
        if (isPlaying) {
            interval = setInterval(() => {
                setCurrentStep(prev => {
                    if (prev < data.states.length - 1) return prev + 1;
                    setIsPlaying(false);
                    return prev;
                });
            }, playbackSpeed);
        }
        return () => clearInterval(interval);
    }, [isPlaying, data.states.length, playbackSpeed]);

    const renderPaper = (paper, index, totalPapers) => {
        const position = calculatePaperPosition(paper, index, totalPapers);
        const isHighlighted = paper.highlighted || false;
        
        return (
            <Group key={`paper-${index}`}>
                {/* Paper shadow */}
                <Rect
                    x={position.x + 2}
                    y={position.y + 2}
                    width={PAPER_WIDTH}
                    height={PAPER_HEIGHT}
                    fill={COLORS.paper.shadow}
                    opacity={0.2}
                    cornerRadius={8}
                />
                
                {/* Paper background with gradient */}
                <Rect
                    x={position.x}
                    y={position.y}
                    width={PAPER_WIDTH}
                    height={PAPER_HEIGHT}
                    fillLinearGradientStartPoint={{ x: 0, y: 0 }}
                    fillLinearGradientEndPoint={{ x: 0, y: PAPER_HEIGHT }}
                    fillLinearGradientColorStops={[
                        0, isHighlighted ? COLORS.highlight.bg : COLORS.paper.default.bg,
                        1, isHighlighted ? '#fde68a' : '#f8fafc'
                    ]}
                    stroke={isHighlighted ? COLORS.highlight.border : COLORS.paper.default.border}
                    strokeWidth={isHighlighted ? 2 : 1}
                    cornerRadius={8}
                    shadowColor="black"
                    shadowBlur={isHighlighted ? 10 : 5}
                    shadowOpacity={0.1}
                />

                {/* Score text */}
                <Text
                    x={position.x}
                    y={position.y + PAPER_HEIGHT/3}
                    width={PAPER_WIDTH}
                    text={paper.score.toString()}
                    align="center"
                    fontSize={24}
                    fontStyle="bold"
                    fill={isHighlighted ? COLORS.highlight.text : COLORS.text.primary}
                />

                {/* "Score" label */}
                <Text
                    x={position.x}
                    y={position.y + 10}
                    width={PAPER_WIDTH}
                    text="Score"
                    align="center"
                    fontSize={12}
                    fill={COLORS.text.secondary}
                />
            </Group>
        );
    };

    const renderPiles = () => {
        if (!currentState.visualElements?.piles) return null;

        return currentState.visualElements.piles.map((pile, index) => {
            const startPaper = pile.papers[0];
            const endPaper = pile.papers[pile.papers.length - 1];
            const startPos = calculatePaperPosition(startPaper, 0, pile.papers.length);
            const endPos = calculatePaperPosition(endPaper, pile.papers.length - 1, pile.papers.length);

            return (
                <Group key={`pile-${index}`}>
                    {/* Pile background with gradient */}
                    <Rect
                        x={startPos.x - 15}
                        y={startPos.y - 15}
                        width={endPos.x - startPos.x + PAPER_WIDTH + 30}
                        height={PAPER_HEIGHT + 30}
                        fillLinearGradientStartPoint={{ x: 0, y: 0 }}
                        fillLinearGradientEndPoint={{ x: 0, y: PAPER_HEIGHT + 30 }}
                        fillLinearGradientColorStops={[0, '#f8fafc', 1, '#f1f5f9']}
                        opacity={0.8}
                        cornerRadius={12}
                        stroke={COLORS.pile.border}
                        strokeWidth={1}
                        dash={[5, 5]}
                        shadowColor="black"
                        shadowBlur={5}
                        shadowOpacity={0.05}
                    />
                    
                    {/* Level indicator */}
                    <Group>
                        <Rect
                            x={startPos.x - 5}
                            y={startPos.y - 35}
                            width={80}
                            height={24}
                            fill={COLORS.secondary}
                            cornerRadius={12}
                            opacity={0.1}
                        />
                        <Text
                            x={startPos.x}
                            y={startPos.y - 30}
                            text={`Level ${Math.log2(pile.papers.length)}`}
                            fontSize={14}
                            fill={COLORS.secondary}
                            fontStyle="bold"
                        />
                    </Group>
                </Group>
            );
        });
    };

    const renderComparisons = () => {
        if (!currentState.visualElements?.comparisons) return null;
        
        return currentState.visualElements.comparisons.map((comparison, index) => {
            const fromPaper = currentState.papers.find(p => p.score === comparison.from.value);
            const toPaper = currentState.papers.find(p => p.score === comparison.to.value);
            
            if (!fromPaper || !toPaper) return null;

            const fromPos = calculatePaperPosition(fromPaper, 0, currentState.papers.length);
            const toPos = calculatePaperPosition(toPaper, 0, currentState.papers.length);

            return (
                <Group key={`comparison-${index}`}>
                    <Arrow
                        points={[
                            fromPos.x + PAPER_WIDTH/2,
                            fromPos.y + PAPER_HEIGHT/2,
                            toPos.x + PAPER_WIDTH/2,
                            toPos.y + PAPER_HEIGHT/2
                        ]}
                        stroke={COLORS.secondary}
                        strokeWidth={2}
                        fill={COLORS.secondary}
                        dash={[5, 5]}
                        shadowColor="black"
                        shadowBlur={3}
                        shadowOpacity={0.2}
                    />
                    
                    {/* Comparison label with background */}
                    <Group>
                        <Rect
                            x={(fromPos.x + toPos.x + PAPER_WIDTH)/2 - 40}
                            y={(fromPos.y + toPos.y)/2 - 25}
                            width={80}
                            height={24}
                            fill={COLORS.secondary}
                            cornerRadius={12}
                            opacity={0.1}
                        />
                        <Text
                            x={(fromPos.x + toPos.x + PAPER_WIDTH)/2 - 40}
                            y={(fromPos.y + toPos.y)/2 - 22}
                            width={80}
                            text="Compare"
                            fontSize={14}
                            fill={COLORS.secondary}
                            align="center"
                            fontStyle="bold"
                        />
                    </Group>
                </Group>
            );
        });
    };

    const renderAlgorithmStructure = () => {
        const { algorithmStructure } = data.metadata;
        if (!algorithmStructure) return null;

        return (
            <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Algorithm Structure</h3>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Loops: {algorithmStructure.loops.length}</span>
                        <span>Functions: {algorithmStructure.functions.length}</span>
                        <span>Conditionals: {algorithmStructure.conditionals.length}</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Controls */}
            <div className="flex items-center justify-between bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="space-x-3">
                    <button
                        onClick={() => setCurrentStep(0)}
                        className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-lg transition-colors"
                    >
                        Reset
                    </button>
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={`px-6 py-2 ${isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-blue-600'} text-white font-medium rounded-lg transition-colors`}
                    >
                        {isPlaying ? '⏸ Pause' : '▶️ Play'}
                    </button>
                    <button
                        onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                        className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-lg transition-colors disabled:opacity-50"
                        disabled={currentStep === 0}
                    >
                        ← Previous
                    </button>
                    <button
                        onClick={() => setCurrentStep(prev => Math.min(data.states.length - 1, prev + 1))}
                        className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-lg transition-colors disabled:opacity-50"
                        disabled={currentStep === data.states.length - 1}
                    >
                        Next →
                    </button>
                </div>
                
                <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-600">Animation Speed:</span>
                    <input
                        type="range"
                        min="200"
                        max="2000"
                        step="100"
                        value={playbackSpeed}
                        onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                        className="w-32 accent-primary"
                    />
                </div>
            </div>

            {/* Description */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 text-blue-900 text-lg font-medium">
                {currentState.description}
            </div>

            {/* Main Visualization */}
            <div className="border border-gray-100 rounded-xl p-6 bg-white shadow-sm">
                <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
                    <Layer>
                        {renderPiles()}
                        {currentState.papers.map((paper, index) => 
                            renderPaper(paper, index, currentState.papers.length)
                        )}
                        {renderComparisons()}
                    </Layer>
                </Stage>
            </div>

            {/* Algorithm Structure */}
            {renderAlgorithmStructure()}

            {/* Metrics Display */}
            <div className="grid grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Comparisons</h3>
                    <p className="text-3xl font-bold text-primary">
                        {currentState.complexity?.comparisons || 0}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Array Accesses</h3>
                    <p className="text-3xl font-bold text-success">
                        {currentState.complexity?.arrayAccesses || 0}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Memory Usage</h3>
                    <div className="mt-2 h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{
                                width: `${(currentState.complexity?.currentMemoryUsage?.main / 
                                    currentState.complexity?.currentMemoryUsage?.total) * 100}%`
                            }}
                        />
                    </div>
                    <div className="mt-2 text-sm text-gray-600 flex justify-between font-medium">
                        <span>Main: {currentState.complexity?.currentMemoryUsage?.main || 0}</span>
                        <span>Aux: {currentState.complexity?.currentMemoryUsage?.auxiliary || 0}</span>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${(currentStep / (data.states.length - 1)) * 100}%` }}
                    />
                </div>
                <div className="mt-3 text-sm text-gray-600 flex justify-between font-medium">
                    <span>Step {currentStep + 1} of {data.states.length}</span>
                    <span>{Math.round((currentStep / (data.states.length - 1)) * 100)}% Complete</span>
                </div>
            </div>
        </div>
    );
} 