'use client';

export default function MergeProcess({ data }) {
    return (
        <div>
            <h4 className="text-lg font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                Node Merging Process
            </h4>
            
            <div className="p-6 border rounded" style={{ 
                backgroundColor: 'var(--color-neutral-25)',
                borderColor: 'var(--color-border-subtle)'
            }}>
                <div className="flex items-center justify-center gap-8">
                    {/* Left Node */}
                    <div className="text-center">
                        <div 
                            className="px-6 py-4 rounded-lg border-2 mb-2"
                            style={{
                                backgroundColor: 'var(--color-primary-100)',
                                borderColor: 'var(--color-primary-300)',
                                color: 'var(--color-text-primary)'
                            }}
                        >
                            <div className="font-bold text-lg">
                                {data.left.char ? `'${data.left.char}'` : 'Internal'}
                            </div>
                            <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                                Frequency: {data.left.freq}
                            </div>
                        </div>
                        <div className="text-xs font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
                            Left Child
                        </div>
                    </div>

                    {/* Plus Symbol */}
                    <div className="text-3xl font-bold" style={{ color: 'var(--color-text-secondary)' }}>
                        +
                    </div>

                    {/* Right Node */}
                    <div className="text-center">
                        <div 
                            className="px-6 py-4 rounded-lg border-2 mb-2"
                            style={{
                                backgroundColor: 'var(--color-secondary-100)',
                                borderColor: 'var(--color-secondary-300)',
                                color: 'var(--color-text-primary)'
                            }}
                        >
                            <div className="font-bold text-lg">
                                {data.right.char ? `'${data.right.char}'` : 'Internal'}
                            </div>
                            <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                                Frequency: {data.right.freq}
                            </div>
                        </div>
                        <div className="text-xs font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
                            Right Child
                        </div>
                    </div>

                    {/* Arrow */}
                    <div className="text-3xl font-bold" style={{ color: 'var(--color-text-secondary)' }}>
                        →
                    </div>

                    {/* Parent Node */}
                    <div className="text-center">
                        <div 
                            className="px-6 py-4 rounded-lg border-2 mb-2"
                            style={{
                                backgroundColor: 'var(--color-success-100)',
                                borderColor: 'var(--color-success-300)',
                                color: 'var(--color-text-primary)'
                            }}
                        >
                            <div className="font-bold text-lg">
                                New Parent
                            </div>
                            <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                                Frequency: {data.parent.freq}
                            </div>
                        </div>
                        <div className="text-xs font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
                            Merged Node
                        </div>
                    </div>
                </div>

                {/* Explanation */}
                <div className="mt-6 p-4 rounded" style={{ backgroundColor: 'var(--color-neutral-50)' }}>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        <strong>Merge Rule:</strong> The two nodes with the lowest frequencies are combined into a new parent node. 
                        The parent's frequency equals the sum of its children's frequencies 
                        ({data.left.freq} + {data.right.freq} = {data.parent.freq}).
                    </p>
                    <div className="mt-2 flex items-center gap-4 text-xs">
                        <span style={{ color: 'var(--color-text-tertiary)' }}>
                            💡 Lower frequency characters will end up deeper in the tree, getting longer codes
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
} 