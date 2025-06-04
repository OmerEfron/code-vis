'use client';

export default function FrequencyChart({ data, inputString }) {
    const maxFreq = Math.max(...Object.values(data));
    const totalChars = Object.values(data).reduce((sum, freq) => sum + freq, 0);

    return (
        <div>
            <h4 className="text-lg font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                Character Frequency Analysis
            </h4>
            
            <div className="mb-6 p-4 rounded" style={{ backgroundColor: 'var(--color-neutral-50)' }}>
                <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                    <strong>Input String:</strong> "{inputString}"
                </p>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    <strong>Total Characters:</strong> {totalChars}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bar Chart */}
                <div>
                    <h5 className="font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>
                        Frequency Visualization
                    </h5>
                    <div className="space-y-3">
                        {Object.entries(data)
                            .sort(([,a], [,b]) => b - a)
                            .map(([char, freq]) => (
                            <div key={char} className="flex items-center gap-3">
                                <div className="w-8 text-center font-mono font-bold text-lg" 
                                     style={{ color: 'var(--color-text-primary)' }}>
                                    '{char}'
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <div 
                                            className="h-6 rounded transition-all duration-700"
                                            style={{
                                                width: `${(freq / maxFreq) * 100}%`,
                                                backgroundColor: 'var(--color-primary-500)',
                                                minWidth: '20px'
                                            }}
                                        />
                                        <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                                            {freq}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Frequency Table */}
                <div>
                    <h5 className="font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>
                        Frequency Table
                    </h5>
                    <div className="border rounded overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr style={{ backgroundColor: 'var(--color-neutral-100)' }}>
                                    <th className="px-4 py-2 text-left font-medium" style={{ color: 'var(--color-text-primary)' }}>
                                        Character
                                    </th>
                                    <th className="px-4 py-2 text-left font-medium" style={{ color: 'var(--color-text-primary)' }}>
                                        Frequency
                                    </th>
                                    <th className="px-4 py-2 text-left font-medium" style={{ color: 'var(--color-text-primary)' }}>
                                        Percentage
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(data)
                                    .sort(([,a], [,b]) => b - a)
                                    .map(([char, freq], index) => (
                                    <tr key={char} style={{ 
                                        backgroundColor: index % 2 === 0 ? 'var(--color-surface)' : 'var(--color-neutral-25)'
                                    }}>
                                        <td className="px-4 py-2 font-mono font-bold" style={{ color: 'var(--color-text-primary)' }}>
                                            '{char}'
                                        </td>
                                        <td className="px-4 py-2" style={{ color: 'var(--color-text-primary)' }}>
                                            {freq}
                                        </td>
                                        <td className="px-4 py-2" style={{ color: 'var(--color-text-secondary)' }}>
                                            {((freq / totalChars) * 100).toFixed(1)}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
} 