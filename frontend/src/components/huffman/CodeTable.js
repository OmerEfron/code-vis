'use client';

export default function CodeTable({ codes }) {
    // Calculate compression stats
    const codeEntries = Object.entries(codes).sort(([,a], [,b]) => a.length - b.length);
    const avgCodeLength = codeEntries.reduce((sum, [, code]) => sum + code.length, 0) / codeEntries.length;

    return (
        <div>
            <h4 className="text-lg font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                Generated Huffman Codes
            </h4>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Code Table */}
                <div>
                    <div className="border rounded overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr style={{ backgroundColor: 'var(--color-neutral-100)' }}>
                                    <th className="px-4 py-3 text-left font-medium" style={{ color: 'var(--color-text-primary)' }}>
                                        Character
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium" style={{ color: 'var(--color-text-primary)' }}>
                                        Huffman Code
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium" style={{ color: 'var(--color-text-primary)' }}>
                                        Length
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {codeEntries.map(([char, code], index) => (
                                    <tr key={char} style={{ 
                                        backgroundColor: index % 2 === 0 ? 'var(--color-surface)' : 'var(--color-neutral-25)'
                                    }}>
                                        <td className="px-4 py-3">
                                            <span className="font-mono font-bold text-lg" style={{ color: 'var(--color-text-primary)' }}>
                                                '{char}'
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span 
                                                className="font-mono bg-gray-100 px-2 py-1 rounded text-sm"
                                                style={{ 
                                                    backgroundColor: 'var(--color-primary-50)',
                                                    color: 'var(--color-primary-700)'
                                                }}
                                            >
                                                {code}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3" style={{ color: 'var(--color-text-secondary)' }}>
                                            {code.length} bit{code.length !== 1 ? 's' : ''}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Statistics and Visual Representation */}
                <div>
                    <h5 className="font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>
                        Code Length Distribution
                    </h5>
                    
                    {/* Visual bars showing code lengths */}
                    <div className="space-y-2 mb-6">
                        {codeEntries.map(([char, code]) => (
                            <div key={char} className="flex items-center gap-3">
                                <div className="w-8 text-center font-mono font-bold" 
                                     style={{ color: 'var(--color-text-primary)' }}>
                                    '{char}'
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <div 
                                            className="h-4 rounded flex items-center justify-center text-xs font-mono text-white"
                                            style={{
                                                width: `${(code.length / Math.max(...codeEntries.map(([,c]) => c.length))) * 100}%`,
                                                backgroundColor: 'var(--color-secondary-500)',
                                                minWidth: '60px'
                                            }}
                                        >
                                            {code}
                                        </div>
                                        <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                                            {code.length} bits
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Statistics */}
                    <div className="p-4 rounded" style={{ backgroundColor: 'var(--color-neutral-50)' }}>
                        <h6 className="font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                            Code Statistics
                        </h6>
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span style={{ color: 'var(--color-text-secondary)' }}>Shortest code:</span>
                                <span className="font-mono" style={{ color: 'var(--color-text-primary)' }}>
                                    {Math.min(...codeEntries.map(([,code]) => code.length))} bits
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span style={{ color: 'var(--color-text-secondary)' }}>Longest code:</span>
                                <span className="font-mono" style={{ color: 'var(--color-text-primary)' }}>
                                    {Math.max(...codeEntries.map(([,code]) => code.length))} bits
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span style={{ color: 'var(--color-text-secondary)' }}>Average length:</span>
                                <span className="font-mono" style={{ color: 'var(--color-text-primary)' }}>
                                    {avgCodeLength.toFixed(1)} bits
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span style={{ color: 'var(--color-text-secondary)' }}>Unique characters:</span>
                                <span className="font-mono" style={{ color: 'var(--color-text-primary)' }}>
                                    {codeEntries.length}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Key Insight */}
            <div className="mt-6 p-4 rounded border-l-4" style={{ 
                backgroundColor: 'var(--color-primary-50)',
                borderLeftColor: 'var(--color-primary-500)'
            }}>
                <h6 className="font-medium mb-2" style={{ color: 'var(--color-primary-700)' }}>
                    💡 Huffman Coding Principle
                </h6>
                <p className="text-sm" style={{ color: 'var(--color-primary-600)' }}>
                    Notice how more frequent characters get shorter codes! This is the key to Huffman coding's efficiency - 
                    the characters that appear most often use the fewest bits, minimizing the total compressed size.
                </p>
            </div>
        </div>
    );
} 