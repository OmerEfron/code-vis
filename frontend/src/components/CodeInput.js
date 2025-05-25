'use client';

import React from 'react';

export default function CodeInput({ value, onChange, isLoading, error }) {
    const textareaId = 'code-input';
    const errorId = error ? `${textareaId}-error` : undefined;
    const helperId = `${textareaId}-helper`;

    const textareaClasses = [
        'input',
        'textarea',
        'font-mono',
        error ? 'input-error' : '',
        'w-full'
    ].filter(Boolean).join(' ');

    return (
        <div className="input-group w-full">
            <label 
                htmlFor={textareaId}
                className="input-label"
            >
                🚀 Paste Your Algorithm Code Here
            </label>
            
            <div className="relative">
                <textarea
                    id={textareaId}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={isLoading}
                    placeholder="// Example: Merge Sort function
function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));
    
    return merge(left, right);
}

function merge(left, right) {
    let result = [];
    // ... merge logic
}

✨ Paste your algorithm code here to see it come to life!"
                    className={textareaClasses}
                    style={{ minHeight: '256px' }}
                    aria-describedby={[errorId, helperId].filter(Boolean).join(' ') || undefined}
                    aria-invalid={error ? 'true' : 'false'}
                />
                
                {isLoading && (
                    <div className="absolute inset-0 bg-surface-overlay flex items-center justify-center rounded-md">
                        <div className="loading-spinner-lg" aria-label="Analyzing code"></div>
                    </div>
                )}
            </div>
            
            {error && (
                <span 
                    id={errorId}
                    className="input-error-message"
                    role="alert"
                >
                    {error}
                </span>
            )}
            
            <div 
                id={helperId}
                className="text-sm"
                style={{ color: 'var(--color-text-secondary)' }}
            >
                <p className="mb-2">
                    🎯 <strong>We'll automatically analyze your code</strong> to identify the algorithm and suggest engaging metaphors!
                </p>
                <div className="flex flex-wrap gap-4 text-xs">
                    <span className="flex items-center gap-1">
                        <span style={{ color: 'var(--color-success-500)' }}>✓</span>
                        <span>Sorting algorithms</span>
                    </span>
                    <span className="flex items-center gap-1">
                        <span style={{ color: 'var(--color-success-500)' }}>✓</span>
                        <span>Search algorithms</span>
                    </span>
                    <span className="flex items-center gap-1">
                        <span style={{ color: 'var(--color-warning-500)' }}>⏳</span>
                        <span>More coming soon!</span>
                    </span>
                </div>
            </div>
        </div>
    );
} 