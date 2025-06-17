'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FrequencyChart({ data, inputString }) {
    const [animatedData, setAnimatedData] = useState({});
    const [hoveredChar, setHoveredChar] = useState(null);
    const [isAnimating, setIsAnimating] = useState(true);
    
    const maxFreq = Math.max(...Object.values(data));
    const totalChars = Object.values(data).reduce((sum, freq) => sum + freq, 0);
    const sortedEntries = Object.entries(data).sort(([,a], [,b]) => b - a);

    // Animate the frequency data on mount
    useEffect(() => {
        setAnimatedData({});
        setIsAnimating(true);
        
        const timer = setTimeout(() => {
            setAnimatedData(data);
            setIsAnimating(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [data]);

    const getCharacterName = (char) => {
        switch (char) {
            case ' ': return 'Space';
            case '\n': return 'Newline';
            case '\t': return 'Tab';
            default: return `'${char}'`;
        }
    };

    const getBarColor = (index, isHovered) => {
        if (isHovered) return 'var(--color-primary-600)';
        
        const intensity = Math.max(0.3, 1 - (index * 0.1));
        return `hsl(210, 100%, ${40 + intensity * 20}%)`;
    };

    return (
        <div>
            <motion.h4 
                className="text-lg font-bold mb-4" 
                style={{ color: 'var(--color-text-primary)' }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Character Frequency Analysis
            </motion.h4>
            
            <motion.div 
                className="mb-6 p-4 rounded-lg border-l-4" 
                style={{ 
                    backgroundColor: 'var(--color-neutral-50)',
                    borderLeftColor: 'var(--color-primary-500)'
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                            <strong>Input String:</strong>
                        </p>
                        <div className="font-mono text-sm p-2 rounded bg-white border max-h-20 overflow-y-auto">
                            {inputString.split('').map((char, index) => (
                                <span
                                    key={index}
                                    className={`${hoveredChar === char ? 'bg-yellow-200' : ''} transition-colors duration-200`}
                                    style={{ 
                                        backgroundColor: hoveredChar === char ? 'var(--color-warning-100)' : 'transparent'
                                    }}
                                >
                                    {char === ' ' ? '·' : char}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                            <strong>Total Characters:</strong> {totalChars}
                        </p>
                        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                            <strong>Unique Characters:</strong> {Object.keys(data).length}
                        </p>
                        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                            <strong>Most Frequent:</strong> {getCharacterName(sortedEntries[0]?.[0])} ({sortedEntries[0]?.[1]} times)
                        </p>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Interactive Bar Chart */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <h5 className="font-medium mb-4 flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
                        📊 Interactive Frequency Chart
                        {isAnimating && <span className="text-xs text-gray-500">(animating...)</span>}
                    </h5>
                    
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                        <AnimatePresence>
                            {sortedEntries.map(([char, freq], index) => {
                                const animatedFreq = animatedData[char] || 0;
                                const percentage = maxFreq > 0 ? (animatedFreq / maxFreq) * 100 : 0;
                                const isHovered = hoveredChar === char;
                                
                                return (
                                    <motion.div 
                                        key={char}
                                        className="group cursor-pointer"
                                        initial={{ opacity: 0, x: -50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        onMouseEnter={() => setHoveredChar(char)}
                                        onMouseLeave={() => setHoveredChar(null)}
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <div className="flex items-center gap-3 p-2 rounded transition-all duration-200"
                                             style={{ backgroundColor: isHovered ? 'var(--color-primary-50)' : 'transparent' }}>
                                            <div className="w-12 text-center font-mono font-bold text-lg flex-shrink-0" 
                                                 style={{ color: 'var(--color-text-primary)' }}>
                                                {getCharacterName(char)}
                                            </div>
                                            
                                            <div className="flex-1 relative">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 bg-gray-200 rounded-full h-4 relative overflow-hidden">
                                                        <motion.div 
                                                            className="h-full rounded-full transition-all duration-500"
                                                            style={{
                                                                backgroundColor: getBarColor(index, isHovered),
                                                                width: `${percentage}%`
                                                            }}
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${percentage}%` }}
                                                            transition={{ duration: 0.8, delay: index * 0.1 }}
                                                        />
                                                        
                                                        {/* Frequency label inside bar */}
                                                        {percentage > 20 && (
                                                            <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                                                                {animatedFreq}
                                                            </span>
                                                        )}
                                                    </div>
                                                    
                                                    {/* Frequency label outside bar */}
                                                    {percentage <= 20 && (
                                                        <span className="text-sm font-medium w-8 text-right" 
                                                              style={{ color: 'var(--color-text-primary)' }}>
                                                            {animatedFreq}
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                {/* Percentage indicator */}
                                                {isHovered && (
                                                    <motion.div 
                                                        className="absolute -top-8 left-0 bg-black text-white text-xs px-2 py-1 rounded pointer-events-none"
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: 10 }}
                                                    >
                                                        {((freq / totalChars) * 100).toFixed(1)}%
                                                    </motion.div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Enhanced Frequency Table */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    <h5 className="font-medium mb-4" style={{ color: 'var(--color-text-primary)' }}>
                        📋 Detailed Statistics
                    </h5>
                    
                    <div className="border rounded-lg overflow-hidden shadow-sm">
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{ backgroundColor: 'var(--color-primary-100)' }}>
                                    <th className="px-3 py-2 text-left font-semibold" style={{ color: 'var(--color-primary-800)' }}>
                                        Character
                                    </th>
                                    <th className="px-3 py-2 text-left font-semibold" style={{ color: 'var(--color-primary-800)' }}>
                                        Count
                                    </th>
                                    <th className="px-3 py-2 text-left font-semibold" style={{ color: 'var(--color-primary-800)' }}>
                                        Percentage
                                    </th>
                                    <th className="px-3 py-2 text-left font-semibold" style={{ color: 'var(--color-primary-800)' }}>
                                        Rank
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {sortedEntries.map(([char, freq], index) => (
                                        <motion.tr 
                                            key={char}
                                            className="group hover:bg-gray-50 cursor-pointer"
                                            style={{ 
                                                backgroundColor: index % 2 === 0 ? 'var(--color-surface)' : 'var(--color-neutral-25)'
                                            }}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                            onMouseEnter={() => setHoveredChar(char)}
                                            onMouseLeave={() => setHoveredChar(null)}
                                            whileHover={{ backgroundColor: 'var(--color-primary-25)' }}
                                        >
                                            <td className="px-3 py-2 font-mono font-bold" style={{ color: 'var(--color-text-primary)' }}>
                                                {getCharacterName(char)}
                                            </td>
                                            <td className="px-3 py-2 font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                                                {freq}
                                            </td>
                                            <td className="px-3 py-2" style={{ color: 'var(--color-text-secondary)' }}>
                                                {((freq / totalChars) * 100).toFixed(1)}%
                                            </td>
                                            <td className="px-3 py-2">
                                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white"
                                                      style={{ backgroundColor: getBarColor(index, false) }}>
                                                    {index + 1}
                                                </span>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </div>
    );
} 