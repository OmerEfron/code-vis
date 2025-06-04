'use client';

import { useState } from 'react';

export default function EncodingResult({ data, inputString }) {
    const [showCharacterMapping, setShowCharacterMapping] = useState(false);
    
    // Calculate compression statistics
    const originalBits = inputString.length * 8; // 8 bits per character in ASCII
    const compressedBits = data.encoded.length;
    const compressionRatio = ((originalBits - compressedBits) / originalBits * 100);
    const spaceSaved = originalBits - compressedBits;

    // Create character-by-character mapping
    const getCharacterMapping = () => {
        // This would need the Huffman codes to map each character
        // For now, we'll show a simplified version
        return inputString.split('').map((char, index) => ({
            char,
            index,
            // We'd need to look up the actual code for each character
        }));
    };

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            // Could add a toast notification here
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    return (
        <div>
            <h4 className="text-lg font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                Final Encoding Result
            </h4>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Original vs Encoded */}
                <div className="space-y-4">
                    <div>
                        <h5 className="font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                            Original String
                        </h5>
                        <div className="p-4 border rounded" style={{ 
                            backgroundColor: 'var(--color-neutral-50)',
                            borderColor: 'var(--color-border-default)'
                        }}>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                                    Text ({inputString.length} characters)
                                </span>
                                <button
                                    onClick={() => copyToClipboard(data.original)}
                                    className="text-xs px-2 py-1 rounded border"
                                    style={{ 
                                        backgroundColor: 'var(--color-surface)',
                                        borderColor: 'var(--color-border-default)',
                                        color: 'var(--color-text-secondary)'
                                    }}
                                >
                                    Copy
                                </button>
                            </div>
                            <div 
                                className="font-mono text-sm break-all p-2 rounded"
                                style={{ 
                                    backgroundColor: 'var(--color-surface)',
                                    color: 'var(--color-text-primary)'
                                }}
                            >
                                "{data.original}"
                            </div>
                        </div>
                    </div>

                    <div>
                        <h5 className="font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                            Huffman Encoded
                        </h5>
                        <div className="p-4 border rounded" style={{ 
                            backgroundColor: 'var(--color-success-50)',
                            borderColor: 'var(--color-success-300)'
                        }}>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium" style={{ color: 'var(--color-success-700)' }}>
                                    Binary ({data.encoded.length} bits)
                                </span>
                                <button
                                    onClick={() => copyToClipboard(data.encoded)}
                                    className="text-xs px-2 py-1 rounded border"
                                    style={{ 
                                        backgroundColor: 'var(--color-surface)',
                                        borderColor: 'var(--color-border-default)',
                                        color: 'var(--color-text-secondary)'
                                    }}
                                >
                                    Copy
                                </button>
                            </div>
                            <div 
                                className="font-mono text-sm break-all p-2 rounded max-h-32 overflow-y-auto"
                                style={{ 
                                    backgroundColor: 'var(--color-surface)',
                                    color: 'var(--color-success-700)',
                                    wordBreak: 'break-all'
                                }}
                            >
                                {data.encoded}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Compression Statistics */}
                <div>
                    <h5 className="font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>
                        Compression Analysis
                    </h5>
                    
                    <div className="space-y-4">
                        {/* Statistics Cards */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 rounded border text-center" style={{ 
                                backgroundColor: 'var(--color-neutral-50)',
                                borderColor: 'var(--color-border-default)'
                            }}>
                                <div className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
                                    {originalBits}
                                </div>
                                <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                                    Original bits
                                </div>
                            </div>
                            
                            <div className="p-3 rounded border text-center" style={{ 
                                backgroundColor: 'var(--color-success-50)',
                                borderColor: 'var(--color-success-300)'
                            }}>
                                <div className="text-lg font-bold" style={{ color: 'var(--color-success-700)' }}>
                                    {compressedBits}
                                </div>
                                <div className="text-xs" style={{ color: 'var(--color-success-600)' }}>
                                    Compressed bits
                                </div>
                            </div>
                        </div>

                        {/* Compression Ratio */}
                        <div className="p-4 rounded border" style={{ 
                            backgroundColor: compressionRatio > 0 ? 'var(--color-success-50)' : 'var(--color-warning-50)',
                            borderColor: compressionRatio > 0 ? 'var(--color-success-300)' : 'var(--color-warning-300)'
                        }}>
                            <div className="text-center">
                                <div className="text-2xl font-bold mb-1" style={{ 
                                    color: compressionRatio > 0 ? 'var(--color-success-700)' : 'var(--color-warning-700)'
                                }}>
                                    {compressionRatio > 0 ? '-' : ''}{Math.abs(compressionRatio).toFixed(1)}%
                                </div>
                                <div className="text-sm" style={{ 
                                    color: compressionRatio > 0 ? 'var(--color-success-600)' : 'var(--color-warning-600)'
                                }}>
                                    {compressionRatio > 0 ? 'Space Saved' : 'Size Increase'}
                                </div>
                                <div className="text-xs mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
                                    {Math.abs(spaceSaved)} bits {compressionRatio > 0 ? 'saved' : 'added'}
                                </div>
                            </div>
                        </div>

                        {/* Breakdown */}
                        <div className="p-3 rounded" style={{ backgroundColor: 'var(--color-neutral-50)' }}>
                            <h6 className="font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                                Breakdown
                            </h6>
                            <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                    <span style={{ color: 'var(--color-text-secondary)' }}>ASCII encoding:</span>
                                    <span style={{ color: 'var(--color-text-primary)' }}>
                                        {inputString.length} × 8 = {originalBits} bits
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span style={{ color: 'var(--color-text-secondary)' }}>Huffman encoding:</span>
                                    <span style={{ color: 'var(--color-text-primary)' }}>
                                        {compressedBits} bits
                                    </span>
                                </div>
                                <div className="flex justify-between border-t pt-1" style={{ borderColor: 'var(--color-border-subtle)' }}>
                                    <span style={{ color: 'var(--color-text-secondary)' }}>Compression ratio:</span>
                                    <span style={{ color: 'var(--color-text-primary)' }}>
                                        {(compressedBits / originalBits).toFixed(3)}:1
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Character Mapping Toggle */}
            <div className="mt-6">
                <button
                    onClick={() => setShowCharacterMapping(!showCharacterMapping)}
                    className="px-4 py-2 rounded border transition-all"
                    style={{
                        backgroundColor: 'var(--color-surface)',
                        borderColor: 'var(--color-border-default)',
                        color: 'var(--color-text-primary)'
                    }}
                >
                    {showCharacterMapping ? '▼' : '▶'} Show Character-by-Character Encoding
                </button>

                {showCharacterMapping && (
                    <div className="mt-4 p-4 border rounded" style={{ 
                        backgroundColor: 'var(--color-surface)',
                        borderColor: 'var(--color-border-default)'
                    }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                            {inputString.split('').map((char, index) => (
                                <div key={index} className="flex items-center gap-2 p-2 rounded" style={{ 
                                    backgroundColor: 'var(--color-neutral-25)'
                                }}>
                                    <span className="font-mono font-bold" style={{ color: 'var(--color-text-primary)' }}>
                                        '{char}'
                                    </span>
                                    <span style={{ color: 'var(--color-text-tertiary)' }}>→</span>
                                    <span className="font-mono text-xs" style={{ 
                                        backgroundColor: 'var(--color-primary-50)',
                                        color: 'var(--color-primary-700)',
                                        padding: '2px 4px',
                                        borderRadius: '2px'
                                    }}>
                                        {/* This would need the actual code mapping */}
                                        ...
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-3 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                            Each character is replaced with its corresponding Huffman code
                        </div>
                    </div>
                )}
            </div>

            {/* Key Insights */}
            <div className="mt-6 p-4 rounded border-l-4" style={{ 
                backgroundColor: 'var(--color-primary-50)',
                borderLeftColor: 'var(--color-primary-500)'
            }}>
                <h6 className="font-medium mb-2" style={{ color: 'var(--color-primary-700)' }}>
                    🎯 Why Huffman Coding Works
                </h6>
                <div className="text-sm space-y-1" style={{ color: 'var(--color-primary-600)' }}>
                    <p>
                        <strong>Variable-length encoding:</strong> Common characters get short codes, rare characters get long codes.
                    </p>
                    <p>
                        <strong>Optimal compression:</strong> Huffman coding produces the optimal prefix-free binary code for the given frequency distribution.
                    </p>
                    <p>
                        <strong>Real-world use:</strong> This algorithm is used in file compression formats like ZIP and JPEG.
                    </p>
                </div>
            </div>
        </div>
    );
} 