'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, ProgressBar, Alert } from './ui';

const AlgorithmVisualization = ({ data }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1000); // milliseconds
  const [visualizationData, setVisualizationData] = useState(null);
  const [error, setError] = useState(null);

  // Initialize visualization data
  useEffect(() => {
    if (data?.success && data?.analysis?.metaphors?.[0]) {
      const metaphor = data.analysis.metaphors[0];
      generateVisualizationSteps(metaphor);
    } else {
      setError('No visualization data available');
    }
  }, [data]);

  // Auto-play functionality
  useEffect(() => {
    let interval;
    if (isPlaying && visualizationData && currentStep < visualizationData.steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => prev + 1);
      }, playSpeed);
    } else if (isPlaying && currentStep >= visualizationData?.steps?.length - 1) {
      setIsPlaying(false);
    }

    return () => clearInterval(interval);
  }, [isPlaying, currentStep, playSpeed, visualizationData]);

  const generateVisualizationSteps = (metaphor) => {
    try {
      // Generate a more comprehensive visualization based on the metaphor
      const steps = [];
      const elements = metaphor.elements || {};
      const metaphorSteps = metaphor.steps || [];
      
      // Get data from the analysis examples or use default
      let exampleArray = [64, 34, 25, 12, 22, 11, 90]; // default fallback
      
      // Try to extract array data from the examples
      if (data?.analysis?.inputs?.examples?.length > 0) {
        const firstExample = data.analysis.inputs.examples[0];
        if (firstExample.input) {
          // For array-based algorithms (sorting, searching)
          if (firstExample.input.array || firstExample.input.a) {
            exampleArray = firstExample.input.array || firstExample.input.a;
          }
          // For other algorithm types, we might need to create a visual representation
          else {
            // Convert other input types to visualizable data
            const inputValues = Object.values(firstExample.input);
            if (inputValues.length > 0) {
              // For string algorithms, we might show character codes or lengths
              if (typeof inputValues[0] === 'string') {
                exampleArray = inputValues[0].split('').map((char, idx) => char.charCodeAt(0));
              }
              // For single values, create a simple demonstration array
              else if (typeof inputValues[0] === 'number') {
                exampleArray = [inputValues[0], inputValues[0] * 2, inputValues[0] + 5, inputValues[0] - 1];
              }
            }
          }
        }
      }
      
      // Initial state
      steps.push({
        title: 'Initial State',
        description: metaphorSteps[0] || 'Starting the algorithm visualization',
        array: [...exampleArray],
        activeIndices: [],
        comparingIndices: [],
        sortedIndices: [],
        highlightedIndices: [],
        metaphorDescription: `${metaphor.description} - We begin with unsorted ${Object.keys(elements)[0] || 'elements'}.`,
        complexity: {
          timeComplexity: data?.analysis?.algorithm?.timeComplexity || 'O(n log n)',
          spaceComplexity: data?.analysis?.algorithm?.spaceComplexity || 'O(n)',
          currentOperation: 'Initialization'
        }
      });

      // Generate intermediate steps based on metaphor
      metaphorSteps.slice(1).forEach((step, index) => {
        const stepIndex = index + 1;
        const newArray = [...exampleArray];
        
        // Simulate algorithm progression
        const activeIdx = stepIndex % newArray.length;
        const comparingIdx = (stepIndex + 1) % newArray.length;
        
        steps.push({
          title: `Step ${stepIndex}`,
          description: step,
          array: newArray,
          activeIndices: [activeIdx],
          comparingIndices: [comparingIdx],
          sortedIndices: Array.from({ length: Math.floor(stepIndex / 2) }, (_, i) => i),
          highlightedIndices: [],
          metaphorDescription: `${step} - ${getMetaphorExplanation(metaphor.name, stepIndex)}`,
          complexity: {
            timeComplexity: data?.analysis?.algorithm?.timeComplexity || 'O(n log n)',
            spaceComplexity: data?.analysis?.algorithm?.spaceComplexity || 'O(n)',
            currentOperation: `Comparing elements at positions ${activeIdx} and ${comparingIdx}`
          }
        });
      });

      // Final sorted state
      const sortedArray = [...exampleArray].sort((a, b) => a - b);
      steps.push({
        title: 'Completed',
        description: 'Algorithm execution completed successfully!',
        array: sortedArray,
        activeIndices: [],
        comparingIndices: [],
        sortedIndices: Array.from({ length: sortedArray.length }, (_, i) => i),
        highlightedIndices: [],
        metaphorDescription: `${metaphor.description} - All ${Object.keys(elements)[0] || 'elements'} are now properly organized!`,
        complexity: {
          timeComplexity: data?.analysis?.algorithm?.timeComplexity || 'O(n log n)',
          spaceComplexity: data?.analysis?.algorithm?.spaceComplexity || 'O(n)',
          currentOperation: 'Completed'
        }
      });

      setVisualizationData({
        metaphor,
        steps,
        algorithm: data?.analysis?.algorithm || {}
      });
      setError(null);
    } catch (err) {
      console.error('Error generating visualization:', err);
      setError('Failed to generate visualization steps');
    }
  };

  const getMetaphorExplanation = (metaphorName, stepIndex) => {
    const explanations = {
      'Teacher Organizing Exams': [
        'The teacher picks up the first pile of exam papers',
        'Comparing scores between two students\' papers',
        'Arranging papers by score from lowest to highest',
        'Creating organized piles of similar scores',
        'Merging smaller piles into larger organized groups'
      ],
      'Library Bookshelf': [
        'Looking at the middle book on the shelf',
        'Comparing book numbers to find the target',
        'Moving to the appropriate section',
        'Narrowing down the search area',
        'Finding the exact book location'
      ],
      'Treasure Hunt': [
        'Starting the search at the first location',
        'Examining each treasure chest sequentially',
        'Checking if this is the treasure we seek',
        'Moving to the next potential location',
        'Continuing the systematic search'
      ]
    };

    const metaphorExplanations = explanations[metaphorName] || [
      'Processing the algorithm step by step',
      'Comparing elements to determine order',
      'Moving elements to their correct positions',
      'Organizing data systematically',
      'Completing the algorithm execution'
    ];

    return metaphorExplanations[stepIndex % metaphorExplanations.length];
  };

  const getComplexityColor = (complexity) => {
    if (complexity.includes('log') || complexity === 'O(1)') return 'viz-complexity-excellent';
    if (complexity.includes('n)') && !complexity.includes('n²')) return 'viz-complexity-good';
    if (complexity.includes('n²')) return 'viz-complexity-average';
    return 'viz-complexity-poor';
  };

  const handlePlay = () => setIsPlaying(!isPlaying);
  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };
  const handleNext = () => {
    if (currentStep < visualizationData.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderArrayElement = (value, index, step) => {
    let elementClass = 'viz-element viz-element-default';
    
    if (step.sortedIndices.includes(index)) {
      elementClass = 'viz-element viz-element-sorted';
    } else if (step.activeIndices.includes(index)) {
      elementClass = 'viz-element viz-element-active';
    } else if (step.comparingIndices.includes(index)) {
      elementClass = 'viz-element viz-element-comparing';
    } else if (step.highlightedIndices.includes(index)) {
      elementClass = 'viz-element viz-element-highlight';
    }

    return (
      <div
        key={index}
        className={elementClass}
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        {value}
      </div>
    );
  };

  if (error) {
    return (
      <Alert variant="error" title="Visualization Error">
        {error}
      </Alert>
    );
  }

  if (!visualizationData) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="loading-spinner-lg" />
        <span className="ml-4">Preparing visualization...</span>
      </div>
    );
  }

  const currentStepData = visualizationData.steps[currentStep];
  const progress = ((currentStep + 1) / visualizationData.steps.length) * 100;

  return (
    <div className="viz-metaphor-container">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
          {visualizationData.metaphor.name}
        </h3>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          {visualizationData.metaphor.description}
        </p>
      </div>

      {/* Progress and Controls */}
      <Card className="mb-4">
        <Card.Body>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="font-semibold">{currentStepData.title}</h4>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Step {currentStep + 1} of {visualizationData.steps.length}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Speed:</span>
              <select
                value={playSpeed}
                onChange={(e) => setPlaySpeed(Number(e.target.value))}
                className="input text-xs p-1"
                style={{ width: '80px' }}
              >
                <option value={2000}>0.5x</option>
                <option value={1000}>1x</option>
                <option value={500}>2x</option>
                <option value={250}>4x</option>
              </select>
            </div>
          </div>

          <ProgressBar
            value={currentStep + 1}
            max={visualizationData.steps.length}
            showPercentage={true}
            className="mb-4"
          />

          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              ⏮ Previous
            </Button>
            
            <Button
              variant={isPlaying ? 'secondary' : 'primary'}
              size="sm"
              onClick={handlePlay}
              disabled={currentStep >= visualizationData.steps.length - 1}
            >
              {isPlaying ? '⏸ Pause' : '▶ Play'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={currentStep >= visualizationData.steps.length - 1}
            >
              Next ⏭
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
            >
              🔄 Reset
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Visualization Area */}
      <Card>
        <Card.Body>
          {/* Array Visualization */}
          <div className="viz-array-container">
            {currentStepData.array.map((value, index) => 
              renderArrayElement(value, index, currentStepData)
            )}
          </div>

          {/* Step Description */}
          <div className="viz-step-description">
            <h4 className="font-medium mb-2">What's Happening?</h4>
            <p className="mb-2">{currentStepData.description}</p>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              <strong>Metaphor:</strong> {currentStepData.metaphorDescription}
            </p>
          </div>

          {/* Complexity Information */}
          <div className="flex items-center justify-between mt-4 p-4 rounded-lg" 
               style={{ backgroundColor: 'var(--color-neutral-50)' }}>
            <div className="flex items-center gap-4">
              <div>
                <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                  Time Complexity:
                </span>
                <div className={`viz-complexity-indicator ${getComplexityColor(currentStepData.complexity.timeComplexity)}`}>
                  {currentStepData.complexity.timeComplexity}
                </div>
              </div>
              
              <div>
                <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                  Space Complexity:
                </span>
                <div className={`viz-complexity-indicator ${getComplexityColor(currentStepData.complexity.spaceComplexity)}`}>
                  {currentStepData.complexity.spaceComplexity}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                Current Operation:
              </span>
              <p className="text-sm font-medium">{currentStepData.complexity.currentOperation}</p>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-surface)' }}>
            <h5 className="text-sm font-medium mb-2">Element States:</h5>
            <div className="flex flex-wrap gap-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="viz-element viz-element-default" style={{ width: '20px', height: '20px', fontSize: '10px' }}>
                  ?
                </div>
                <span>Default</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="viz-element viz-element-active" style={{ width: '20px', height: '20px', fontSize: '10px' }}>
                  A
                </div>
                <span>Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="viz-element viz-element-comparing" style={{ width: '20px', height: '20px', fontSize: '10px' }}>
                  C
                </div>
                <span>Comparing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="viz-element viz-element-sorted" style={{ width: '20px', height: '20px', fontSize: '10px' }}>
                  ✓
                </div>
                <span>Sorted</span>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AlgorithmVisualization; 