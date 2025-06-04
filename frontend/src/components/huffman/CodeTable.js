'use client';

import { useState, useEffect } from 'react';

export default function CodeTable({ codes }) {
    const [selectedCode, setSelectedCode] = useState(null);
    const [animationPhase, setAnimationPhase] = useState(0);
    const [isAnimating, setIsAnimating] = useState(true);

    // Calculate compression stats
    const codeEntries = Object.entries(codes).sort(([,a], [,b]) => a.length - b.length);
    const avgCodeLength = codeEntries.reduce((sum, [, code]) => sum + code.length, 0) / codeEntries.length;
    const maxCodeLength = Math.max(...codeEntries.map(([,code]) => code.length));
    const minCodeLength = Math.min(...codeEntries.map(([,code]) => code.length));

    // Animation for showing codes progressively
    useEffect(() => {
        if (isAnimating && animationPhase < codeEntries.length) {
            const timer = setTimeout(() => {
                setAnimationPhase(prev => prev + 1);
            }, 500);
            return () => clearTimeout(timer);
        } else if (animationPhase >= codeEntries.length) {
            setIsAnimating(false);
        }
    }, [animationPhase, codeEntries.length, isAnimating]);

    const handleCodeClick = (char, code) => {
        setSelectedCode({ char, code, length: code.length });
    };

    const resetAnimation = () => {
        setAnimationPhase(0);
        setIsAnimating(true);
        setSelectedCode(null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
                    📝 Generated Huffman Codes
                </h4>
                <button
                    onClick={resetAnimation}
                    className="px-3 py-1 text-sm rounded border"
                    style={{
                        backgroundColor: 'var(--color-surface)',
                        borderColor: 'var(--color-border-default)',
                        color: 'var(--color-text-primary)'
                    }}
                >
                    🔄 Replay Animation
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Interactive Code Table */}
                <div className="lg:col-span-2">
                    <div className="border rounded overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr style={{ backgroundColor: 'var(--color-primary-100)' }}>
                                    <th className="px-4 py-3 text-left font-medium" style={{ color: 'var(--color-primary-700)' }}>
                                        Character
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium" style={{ color: 'var(--color-primary-700)' }}>
                                        Binary Code
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium" style={{ color: 'var(--color-primary-700)' }}>
                                        Length
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium" style={{ color: 'var(--color-primary-700)' }}>
                                        Path
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {codeEntries.map(([char, code], index) => {
                                    const isVisible = animationPhase > index;
                                    const isSelected = selectedCode?.char === char;
                                    const isEfficient = code.length === minCodeLength;
                                    
                                    return (
                                        <tr 
                                            key={char} 
                                            onClick={() => handleCodeClick(char, code)}
                                            className={`cursor-pointer transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-30'}`}
                                            style={{ 
                                                backgroundColor: isSelected 
                                                    ? 'var(--color-primary-50)' 
                                                    : index % 2 === 0 
                                                        ? 'var(--color-surface)' 
                                                        : 'var(--color-neutral-25)',
                                                borderLeft: isEfficient ? '4px solid var(--color-success-500)' : 'none',
                                                transform: isVisible ? 'translateX(0)' : 'translateX(-20px)'
                                            }}
                                        >
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono font-bold text-lg" style={{ color: 'var(--color-text-primary)' }}>
                                                        '{char}'
                                                    </span>
                                                    {isEfficient && (
                                                        <span className="text-xs px-2 py-1 rounded" style={{ 
                                                            backgroundColor: 'var(--color-success-100)',
                                                            color: 'var(--color-success-700)'
                                                        }}>
                                                            Most Efficient
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span 
                                                    className="font-mono px-3 py-1 rounded text-sm font-medium transition-all"
                                                    style={{ 
                                                        backgroundColor: isSelected ? 'var(--color-primary-200)' : 'var(--color-primary-50)',
                                                        color: isSelected ? 'var(--color-primary-800)' : 'var(--color-primary-700)',
                                                        border: isSelected ? '2px solid var(--color-primary-400)' : '1px solid var(--color-primary-200)'
                                                    }}
                                                >
                                                    {code}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <span style={{ color: 'var(--color-text-secondary)' }}>
                                                        {code.length} bit{code.length !== 1 ? 's' : ''}
                                                    </span>
                                                    {code.length === minCodeLength && (
                                                        <span className="text-xs">🏆</span>
                                                    )}
                                                    {code.length === maxCodeLength && (
                                                        <span className="text-xs">📏</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1 text-xs font-mono">
                                                    {code.split('').map((bit, bitIndex) => (
                                                        <span 
                                                            key={bitIndex}
                                                            className="px-1 rounded"
                                                            style={{
                                                                backgroundColor: bit === '0' ? 'var(--color-red-100)' : 'var(--color-blue-100)',
                                                                color: bit === '0' ? 'var(--color-red-700)' : 'var(--color-blue-700)'
                                                            }}
                                                        >
                                                            {bit === '0' ? 'L' : 'R'}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Visual Code Length Bars */}
                    <div className="mt-4">
                        <h6 className="font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>
                            📊 Code Length Visualization
                        </h6>
                        <div className="space-y-2">
                            {codeEntries.map(([char, code], index) => {
                                const isVisible = animationPhase > index;
                                const isSelected = selectedCode?.char === char;
                                
                                return (
                                    <div 
                                        key={char} 
                                        className={`flex items-center gap-3 transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-30'}`}
                                        style={{ transform: isVisible ? 'translateX(0)' : 'translateX(-30px)' }}
                                    >
                                        <div className="w-8 text-center font-mono font-bold" 
                                             style={{ color: 'var(--color-text-primary)' }}>
                                            '{char}'
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <div 
                                                    className="h-5 rounded flex items-center justify-center text-xs font-mono text-white transition-all duration-700"
                                                    style={{
                                                        width: isVisible ? `${(code.length / maxCodeLength) * 100}%` : '0%',
                                                        backgroundColor: isSelected 
                                                            ? 'var(--color-primary-600)' 
                                                            : code.length === minCodeLength 
                                                                ? 'var(--color-success-500)'
                                                                : 'var(--color-secondary-500)',
                                                        minWidth: '80px',
                                                        border: isSelected ? '2px solid var(--color-primary-300)' : 'none'
                                                    }}
                                                >
                                                    {isVisible && code}
                                                </div>
                                                <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                                                    {code.length} bits
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Statistics and Selected Code Info */}
                <div>
                    {/* Selected Code Details */}
                    {selectedCode && (
                        <div className="mb-4 p-4 rounded border" style={{ 
                            backgroundColor: 'var(--color-primary-50)',
                            borderColor: 'var(--color-primary-300)'
                        }}>
                            <h6 className="font-medium mb-2" style={{ color: 'var(--color-primary-700)' }}>
                                🔍 Selected Code: '{selectedCode.char}'
                            </h6>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Binary Code:</span>
                                    <span className="font-mono font-bold">{selectedCode.code}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Length:</span>
                                    <span>{selectedCode.length} bits</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tree Path:</span>
                                    <span className="text-xs">
                                        {selectedCode.code.split('').map((bit, i) => 
                                            <span key={i} style={{ 
                                                color: bit === '0' ? 'var(--color-red-600)' : 'var(--color-blue-600)' 
                                            }}>
                                                {bit === '0' ? 'Left' : 'Right'}{i < selectedCode.code.length - 1 ? ' → ' : ''}
                                            </span>
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Efficiency:</span>
                                    <span className={selectedCode.length === minCodeLength ? 'text-green-600 font-medium' : ''}>
                                        {selectedCode.length === minCodeLength ? 'Optimal ⭐' : 'Standard'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Statistics */}
                    <div className="p-4 rounded border" style={{ 
                        backgroundColor: 'var(--color-surface)',
                        borderColor: 'var(--color-border-default)'
                    }}>
                        <h6 className="font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>
                            📈 Code Statistics
                        </h6>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center">
                                <span style={{ color: 'var(--color-text-secondary)' }}>Shortest code:</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono font-bold" style={{ color: 'var(--color-success-600)' }}>
                                        {minCodeLength} bits
                                    </span>
                                    <span className="text-xs">🏆</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span style={{ color: 'var(--color-text-secondary)' }}>Longest code:</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono font-bold" style={{ color: 'var(--color-text-primary)' }}>
                                        {maxCodeLength} bits
                                    </span>
                                    <span className="text-xs">📏</span>
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <span style={{ color: 'var(--color-text-secondary)' }}>Average length:</span>
                                <span className="font-mono font-bold" style={{ color: 'var(--color-text-primary)' }}>
                                    {avgCodeLength.toFixed(1)} bits
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span style={{ color: 'var(--color-text-secondary)' }}>Total characters:</span>
                                <span className="font-mono font-bold" style={{ color: 'var(--color-text-primary)' }}>
                                    {codeEntries.length}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span style={{ color: 'var(--color-text-secondary)' }}>Compression ratio:</span>
                                <span className="font-mono font-bold" style={{ color: 'var(--color-success-600)' }}>
                                    {(8 / avgCodeLength).toFixed(1)}:1
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Educational Tips */}
                    <div className="mt-4 p-3 rounded border-l-4" style={{ 
                        backgroundColor: 'var(--color-warning-50)',
                        borderLeftColor: 'var(--color-warning-500)'
                    }}>
                        <h6 className="font-medium mb-2" style={{ color: 'var(--color-warning-700)' }}>
                            💡 Teaching Tips
                        </h6>
                        <div className="text-xs space-y-1" style={{ color: 'var(--color-warning-600)' }}>
                            <p>• Click any row to see path details</p>
                            <p>• Green border = most efficient code</p>
                            <p>• L/R shows tree traversal path</p>
                            <p>• Shorter codes = better compression</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Key Insights */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded border-l-4" style={{ 
                    backgroundColor: 'var(--color-primary-50)',
                    borderLeftColor: 'var(--color-primary-500)'
                }}>
                    <h6 className="font-medium mb-2" style={{ color: 'var(--color-primary-700)' }}>
                        🎯 Huffman Principle
                    </h6>
                    <p className="text-sm" style={{ color: 'var(--color-primary-600)' }}>
                        Notice how more frequent characters get shorter codes! This is the key to Huffman coding's efficiency - 
                        the characters that appear most often use the fewest bits.
                    </p>
                </div>

                <div className="p-4 rounded border-l-4" style={{ 
                    backgroundColor: 'var(--color-success-50)',
                    borderLeftColor: 'var(--color-success-500)'
                }}>
                    <h6 className="font-medium mb-2" style={{ color: 'var(--color-success-700)' }}>
                        📊 Compression Benefits
                    </h6>
                    <p className="text-sm" style={{ color: 'var(--color-success-600)' }}>
                        Standard ASCII uses 8 bits per character. Our Huffman codes average {avgCodeLength.toFixed(1)} bits - 
                        that's a {((1 - avgCodeLength/8) * 100).toFixed(1)}% reduction in size!
                    </p>
                </div>
            </div>
        </div>
    );
} 