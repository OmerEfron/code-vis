'use client';

export default function TreeVisualization({ tree }) {
    const renderNode = (node, depth = 0, path = '') => {
        if (!node) return null;

        const isLeaf = node.char !== null;
        const indent = depth * 40;

        return (
            <div key={`${depth}-${node.char || node.freq}`} className="mb-2">
                <div 
                    className="flex items-center"
                    style={{ marginLeft: `${indent}px` }}
                >
                    <div 
                        className="px-3 py-2 rounded border inline-block"
                        style={{
                            backgroundColor: isLeaf ? 'var(--color-success-100)' : 'var(--color-neutral-100)',
                            borderColor: isLeaf ? 'var(--color-success-300)' : 'var(--color-neutral-300)',
                            color: 'var(--color-text-primary)'
                        }}
                    >
                        {isLeaf ? (
                            <span className="font-mono font-bold">
                                '{node.char}' ({node.freq})
                            </span>
                        ) : (
                            <span>
                                Internal ({node.freq})
                            </span>
                        )}
                        {path && (
                            <span className="ml-2 text-xs font-mono" style={{ color: 'var(--color-text-secondary)' }}>
                                Code: {path}
                            </span>
                        )}
                    </div>
                </div>
                
                {node.left && (
                    <div className="ml-4">
                        <div className="text-xs mb-1" style={{ 
                            color: 'var(--color-text-tertiary)',
                            marginLeft: `${indent + 10}px` 
                        }}>
                            ← 0
                        </div>
                        {renderNode(node.left, depth + 1, path + '0')}
                    </div>
                )}
                
                {node.right && (
                    <div className="ml-4">
                        <div className="text-xs mb-1" style={{ 
                            color: 'var(--color-text-tertiary)',
                            marginLeft: `${indent + 10}px` 
                        }}>
                            → 1
                        </div>
                        {renderNode(node.right, depth + 1, path + '1')}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div>
            <h4 className="text-lg font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                Huffman Tree Structure
            </h4>
            <div className="p-4 border rounded overflow-auto" style={{ 
                backgroundColor: 'var(--color-neutral-25)',
                borderColor: 'var(--color-border-subtle)',
                maxHeight: '500px'
            }}>
                {tree ? renderNode(tree) : <p>No tree data available</p>}
            </div>
            <div className="mt-4 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                <p><strong>Legend:</strong></p>
                <p>• Green boxes = Leaf nodes (characters)</p>
            </div>
        </div>
    );
} 