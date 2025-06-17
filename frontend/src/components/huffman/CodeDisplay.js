'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CodeDisplay({ 
    codes = {}, 
    originalText = '', 
    encodedText = '', 
    showEncoding = false 
}) {
    const [selectedChar, setSelectedChar] = useState(null);
    const [showComparison, setShowComparison] = useState(false);

    const codeEntries = Object.entries(codes).sort((a, b) => a[1].length - b[1].length);

    const calculateStats = () => {
        if (!originalText || !encodedText) return null;

        const originalBits = originalText.length * 8; // ASCII = 8 bits per character
        const compressedBits = encodedText.length;
        const compressionRatio = ((originalBits - compressedBits) / originalBits * 100).toFixed(1);
        const averageBitsPerChar = (compressedBits / originalText.length).toFixed(2);

        return {
            originalBits,
            compressedBits,
            compressionRatio: parseFloat(compressionRatio),
            averageBitsPerChar: parseFloat(averageBitsPerChar),
            spaceSaved: originalBits - compressedBits
        };
    };

    const stats = calculateStats();

    const getCodeColor = (codeLength) => {
        // Shorter codes get cooler colors, longer codes get warmer colors
        if (codeLength <= 2) return 'var(--color-success-500)';
        if (codeLength <= 4) return 'var(--color-warning-500)';
        return 'var(--color-danger-500)';
    };

    const highlightCharInText = (text, targetChar) => {
        if (!targetChar) return text;
        
        return text.split('').map((char, index) => (
            <span
                key={index}
                className={char === targetChar ? 'bg-yellow-200 px-1 rounded' : ''}
                style={char === targetChar ? { backgroundColor: 'var(--color-warning-100)' } : {}}
            >
                {char}
            </span>
        ));
    };

    if (Object.keys(codes).length === 0) {
        return (
            <div className="flex items-center justify-center h-32">
                <div className="text-center">
                    <div className="text-2xl mb-2">💻</div>
                    <p style={{ color: 'var(--color-text-secondary)' }}>
                        Huffman codes will appear here
                    </p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <h4 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
                    {showEncoding ? 'Text Encoding Results' : 'Generated Huffman Codes'}
                </h4>
                {showEncoding && stats && (
                    <motion.button
                        onClick={() => setShowComparison(!showComparison)}
                        className="flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium transition-all"
                        style={{
                            backgroundColor: 'var(--color-primary-100)',
                            color: 'var(--color-primary-700)'
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        {showComparison ? 'Hide Stats' : 'Show Stats'}
                    </motion.button>
                )}
            </div>

            {/* Compression Statistics */}
            {showEncoding && stats && showComparison && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 rounded-lg border"
                    style={{ 
                        backgroundColor: stats.compressionRatio > 0 ? 'var(--color-success-50)' : 'var(--color-warning-50)',
                        borderColor: stats.compressionRatio > 0 ? 'var(--color-success-200)' : 'var(--color-warning-200)'
                    }}
                >
                    <h5 className="font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                        Compression Analysis
                    </h5>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                            <div className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                                Original Size
                            </div>
                            <div className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
                                {stats.originalBits} bits
                            </div>
                            <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                                ({originalText.length} chars × 8)
                            </div>
                        </div>
                        
                        <div className="text-center">
                            <div className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                                Compressed Size
                            </div>
                            <div className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
                                {stats.compressedBits} bits
                            </div>
                            <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                                Variable length codes
                            </div>
                        </div>
                        
                        <div className="text-center">
                            <div className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                                Compression Ratio
                            </div>
                            <div className={`text-lg font-bold ${stats.compressionRatio > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {stats.compressionRatio > 0 ? '+' : ''}{stats.compressionRatio}%
                            </div>
                            <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                                {stats.compressionRatio > 0 ? 'Space saved' : 'Space increased'}
                            </div>
                        </div>
                        
                        <div className="text-center">
                            <div className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                                Avg Bits/Char
                            </div>
                            <div className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
                                {stats.averageBitsPerChar}
                            </div>
                            <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                                vs 8.0 (ASCII)
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Original Text with Character Highlighting */}
            {showEncoding && originalText && (
                <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border-default)' }}>
                    <h5 className="font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                        Original Text:
                    </h5>
                    <div className="p-3 rounded font-mono text-sm border" 
                         style={{ backgroundColor: 'var(--color-neutral-50)', borderColor: 'var(--color-border-default)' }}>
                        {highlightCharInText(originalText, selectedChar)}
                    </div>
                </div>
            )}

            {/* Huffman Codes Table */}
            <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border-default)' }}>
                <h5 className="font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                    Character Codes:
                </h5>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {codeEntries.map(([char, code], index) => (
                        <motion.div
                            key={char}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className={`
                                p-3 rounded-lg border-2 cursor-pointer transition-all duration-200
                                ${selectedChar === char 
                                    ? 'border-blue-500 shadow-lg' 
                                    : 'border-gray-200 hover:border-gray-300'
                                }
                            `}
                            style={{ backgroundColor: 'var(--color-neutral-50)' }}
                            onClick={() => setSelectedChar(selectedChar === char ? null : char)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white"
                                         style={{ backgroundColor: getCodeColor(code.length) }}>
                                        {char === ' ' ? '·' : char}
                                    </div>
                                    <div>
                                        <div className="font-mono font-bold" style={{ color: 'var(--color-text-primary)' }}>
                                            {code}
                                        </div>
                                        <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                                            {char === ' ' ? 'space' : `'${char}'`} • {code.length} bits
                                        </div>
                                    </div>
                                </div>
                                
                                {originalText && (
                                    <div className="text-xs text-center" style={{ color: 'var(--color-text-secondary)' }}>
                                        <div>Freq:</div>
                                        <div className="font-bold">
                                            {(originalText.split('').filter(c => c === char).length)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t text-sm" 
                     style={{ borderColor: 'var(--color-border-default)', color: 'var(--color-text-secondary)' }}>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--color-success-500)' }}></div>
                        <span>Short codes (≤2 bits)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--color-warning-500)' }}></div>
                        <span>Medium codes (3-4 bits)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--color-danger-500)' }}></div>
                        <span>Long codes (5+ bits)</span>
                    </div>
                </div>
            </div>

            {/* Encoded Text */}
            {showEncoding && encodedText && (
                <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border-default)' }}>
                    <h5 className="font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                        Encoded Text:
                    </h5>
                    <div className="p-3 rounded font-mono text-sm border break-all" 
                         style={{ backgroundColor: 'var(--color-neutral-50)', borderColor: 'var(--color-border-default)' }}>
                        {encodedText.split('').map((bit, index) => (
                            <span
                                key={index}
                                className={bit === '1' ? 'text-blue-600 font-bold' : 'text-gray-600'}
                            >
                                {bit}
                            </span>
                        ))}
                    </div>
                    <div className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        Total length: {encodedText.length} bits
                    </div>
                </div>
            )}

            {/* Interactive Helper */}
            {selectedChar && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 rounded-lg border-l-4"
                    style={{ 
                        backgroundColor: 'var(--color-primary-50)', 
                        borderColor: 'var(--color-primary-500)' 
                    }}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white"
                             style={{ backgroundColor: getCodeColor(codes[selectedChar].length) }}>
                            {selectedChar === ' ' ? '·' : selectedChar}
                        </div>
                        <div>
                            <span className="font-bold" style={{ color: 'var(--color-text-primary)' }}>
                                Character: {selectedChar === ' ' ? 'Space' : `'${selectedChar}'`}
                            </span>
                            <span className="ml-4 font-mono font-bold" style={{ color: 'var(--color-primary-600)' }}>
                                Code: {codes[selectedChar]}
                            </span>
                        </div>
                    </div>
                    {originalText && (
                        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                            This character appears <strong>{originalText.split('').filter(c => c === selectedChar).length}</strong> times 
                            in the text and uses <strong>{codes[selectedChar].length}</strong> bits per occurrence.
                        </p>
                    )}
                </motion.div>
            )}
        </motion.div>
    );
} 