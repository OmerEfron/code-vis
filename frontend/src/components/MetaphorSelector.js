'use client';

import React from 'react';
import { Card } from './ui';

export default function MetaphorSelector({ metaphors, onSelect, selected }) {
    const getMetaphorCardStyle = (metaphor) => {
        const isSelected = selected === metaphor;
        return {
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
            borderColor: isSelected 
                ? 'var(--color-primary-500)' 
                : 'var(--color-border-default)',
            backgroundColor: isSelected 
                ? 'var(--color-primary-50)' 
                : 'var(--color-surface)',
            borderWidth: '2px',
            transform: isSelected ? 'translateY(-2px)' : 'none',
            boxShadow: isSelected 
                ? 'var(--shadow-lg)' 
                : 'var(--shadow-md)'
        };
    };

    const handleKeyDown = (event, metaphor) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onSelect(metaphor);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <h3 className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                Choose a Metaphor
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {metaphors.map((metaphor, index) => (
                    <Card
                        key={index}
                        style={getMetaphorCardStyle(metaphor)}
                        onClick={() => onSelect(metaphor)}
                        onKeyDown={(e) => handleKeyDown(e, metaphor)}
                        tabIndex={0}
                        role="button"
                        aria-pressed={selected === metaphor}
                        aria-label={`Select ${metaphor.name} metaphor`}
                    >
                        <Card.Body>
                            <Card.Title as="h4" className="mb-2">
                                {metaphor.name}
                            </Card.Title>
                            
                            <Card.Subtitle className="mb-4">
                                {metaphor.description}
                            </Card.Subtitle>
                            
                            <div className="flex flex-col gap-4">
                                <div className="text-sm">
                                    <span 
                                        className="font-medium"
                                        style={{ color: 'var(--color-text-primary)' }}
                                    >
                                        Learning Style:
                                    </span>
                                    <span 
                                        className="ml-2 px-2 py-1 rounded"
                                        style={{ 
                                            backgroundColor: 'var(--color-secondary-100)', 
                                            color: 'var(--color-secondary-700)',
                                            fontSize: 'var(--text-xs)'
                                        }}
                                    >
                                        {metaphor.learningStyle}
                                    </span>
                                </div>
                                
                                {metaphor.elements && (
                                    <div className="text-sm">
                                        <span 
                                            className="font-medium"
                                            style={{ color: 'var(--color-text-primary)' }}
                                        >
                                            Key Elements:
                                        </span>
                                        <ul className="mt-2 space-y-1">
                                            {Object.entries(metaphor.elements).map(([key, value]) => (
                                                <li 
                                                    key={key} 
                                                    className="flex"
                                                    style={{ color: 'var(--color-text-secondary)' }}
                                                >
                                                    <span className="font-medium mr-2">{key}:</span>
                                                    <span>{value}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                
                                {metaphor.steps && metaphor.steps.length > 0 && (
                                    <div className="text-sm">
                                        <span 
                                            className="font-medium"
                                            style={{ color: 'var(--color-text-primary)' }}
                                        >
                                            Process Steps:
                                        </span>
                                        <ol className="mt-2 space-y-1">
                                            {metaphor.steps.slice(0, 3).map((step, stepIndex) => (
                                                <li 
                                                    key={stepIndex} 
                                                    className="flex"
                                                    style={{ color: 'var(--color-text-secondary)' }}
                                                >
                                                    <span className="font-medium mr-2">{stepIndex + 1}.</span>
                                                    <span>{step}</span>
                                                </li>
                                            ))}
                                            {metaphor.steps.length > 3 && (
                                                <li 
                                                    className="text-xs italic"
                                                    style={{ color: 'var(--color-text-tertiary)' }}
                                                >
                                                    ... and {metaphor.steps.length - 3} more steps
                                                </li>
                                            )}
                                        </ol>
                                    </div>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                ))}
            </div>
        </div>
    );
} 