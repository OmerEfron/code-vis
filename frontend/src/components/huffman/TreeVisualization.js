'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TreeVisualization({ tree, step = 0 }) {
    const [animatedTree, setAnimatedTree] = useState(null);
    const [hoveredNode, setHoveredNode] = useState(null);
    const [selectedNode, setSelectedNode] = useState(null);
    const svgRef = useRef(null);

    useEffect(() => {
        if (tree) {
            // Simulate tree building animation
            const timer = setTimeout(() => {
                setAnimatedTree(tree);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [tree]);

    const calculateNodePositions = (node, x = 400, y = 50, level = 0, index = 0, totalNodes = 1) => {
        if (!node) return [];

        const positions = [];
        const nodeSize = 40;
        const levelHeight = 80;
        const horizontalSpacing = Math.max(60, 200 / Math.pow(2, level));

        // Calculate position for current node
        const nodePos = {
            id: `${x}-${y}-${level}`,
            x,
            y,
            char: node.char,
            freq: node.freq,
            level,
            isLeaf: !node.left && !node.right,
            parentX: x,
            parentY: y - levelHeight
        };

        positions.push(nodePos);

        // Calculate positions for children
        if (node.left) {
            const leftPositions = calculateNodePositions(
                node.left,
                x - horizontalSpacing,
                y + levelHeight,
                level + 1,
                index * 2,
                totalNodes * 2
            );
            positions.push(...leftPositions);
        }

        if (node.right) {
            const rightPositions = calculateNodePositions(
                node.right,
                x + horizontalSpacing,
                y + levelHeight,
                level + 1,
                index * 2 + 1,
                totalNodes * 2
            );
            positions.push(...rightPositions);
        }

        return positions;
    };

    const calculateEdges = (node, x = 400, y = 50, level = 0) => {
        if (!node) return [];

        const edges = [];
        const levelHeight = 80;
        const horizontalSpacing = Math.max(60, 200 / Math.pow(2, level));

        if (node.left) {
            edges.push({
                id: `edge-${x}-${y}-left`,
                x1: x,
                y1: y,
                x2: x - horizontalSpacing,
                y2: y + levelHeight,
                label: '0'
            });
            edges.push(...calculateEdges(node.left, x - horizontalSpacing, y + levelHeight, level + 1));
        }

        if (node.right) {
            edges.push({
                id: `edge-${x}-${y}-right`,
                x1: x,
                y1: y,
                x2: x + horizontalSpacing,
                y2: y + levelHeight,
                label: '1'
            });
            edges.push(...calculateEdges(node.right, x + horizontalSpacing, y + levelHeight, level + 1));
        }

        return edges;
    };

    const getNodeColor = (node, level) => {
        if (hoveredNode === node.id) return 'var(--color-warning-400)';
        if (selectedNode === node.id) return 'var(--color-success-500)';
        if (node.isLeaf) return 'var(--color-primary-500)';
        
        // Color by level for internal nodes
        const colors = [
            'var(--color-secondary-400)',
            'var(--color-secondary-500)',
            'var(--color-secondary-600)',
            'var(--color-secondary-700)'
        ];
        return colors[Math.min(level, colors.length - 1)];
    };

    if (!tree) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="text-4xl mb-2">🌳</div>
                    <p style={{ color: 'var(--color-text-secondary)' }}>
                        Tree visualization will appear here
                    </p>
                </div>
            </div>
        );
    }

    const nodePositions = calculateNodePositions(animatedTree || tree);
    const edges = calculateEdges(animatedTree || tree);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full"
        >
            <div className="mb-4">
                <h4 className="text-lg font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                    Huffman Tree Visualization
                </h4>
                <div className="flex gap-4 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'var(--color-primary-500)' }}></div>
                        <span>Leaf Nodes (Characters)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'var(--color-secondary-500)' }}></div>
                        <span>Internal Nodes</span>
                    </div>
                </div>
            </div>

            <div className="border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-purple-50 overflow-x-auto">
                <svg
                    ref={svgRef}
                    width="800"
                    height="400"
                    viewBox="0 0 800 400"
                    className="w-full h-auto"
                    style={{ minHeight: '300px' }}
                >
                    {/* Background grid for better visualization */}
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path
                                d="M 40 0 L 0 0 0 40"
                                fill="none"
                                stroke="#e5e7eb"
                                strokeWidth="1"
                                opacity="0.3"
                            />
                        </pattern>
                        
                        {/* Glow effect for selected nodes */}
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                            <feMerge> 
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>

                    <rect width="100%" height="100%" fill="url(#grid)" />

                    {/* Render edges first */}
                    <AnimatePresence>
                        {edges.map((edge, index) => (
                            <g key={edge.id}>
                                <motion.line
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    x1={edge.x1}
                                    y1={edge.y1}
                                    x2={edge.x2}
                                    y2={edge.y2}
                                    stroke="var(--color-neutral-400)"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                                
                                {/* Edge labels (0 and 1) */}
                                <motion.text
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                                    x={(edge.x1 + edge.x2) / 2}
                                    y={(edge.y1 + edge.y2) / 2 - 5}
                                    textAnchor="middle"
                                    fontSize="12"
                                    fill="var(--color-text-primary)"
                                    fontWeight="bold"
                                    className="pointer-events-none"
                                >
                                    {edge.label}
                                </motion.text>
                            </g>
                        ))}
                    </AnimatePresence>

                    {/* Render nodes */}
                    <AnimatePresence>
                        {nodePositions.map((node, index) => (
                            <g key={node.id}>
                                {/* Node circle with glow effect when selected */}
                                <motion.circle
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ 
                                        duration: 0.4, 
                                        delay: index * 0.1,
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 20
                                    }}
                                    cx={node.x}
                                    cy={node.y}
                                    r="20"
                                    fill={getNodeColor(node, node.level)}
                                    stroke="white"
                                    strokeWidth="2"
                                    filter={selectedNode === node.id ? "url(#glow)" : "none"}
                                    className="cursor-pointer transition-all duration-200"
                                    style={{
                                        transformOrigin: `${node.x}px ${node.y}px`
                                    }}
                                    onMouseEnter={() => setHoveredNode(node.id)}
                                    onMouseLeave={() => setHoveredNode(null)}
                                    onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                />

                                {/* Node content */}
                                <motion.text
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                                    x={node.x}
                                    y={node.y - 2}
                                    textAnchor="middle"
                                    fontSize="12"
                                    fill="white"
                                    fontWeight="bold"
                                    className="pointer-events-none"
                                >
                                    {node.char || '•'}
                                </motion.text>

                                {/* Frequency label */}
                                <motion.text
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
                                    x={node.x}
                                    y={node.y + 8}
                                    textAnchor="middle"
                                    fontSize="10"
                                    fill="white"
                                    className="pointer-events-none"
                                >
                                    {node.freq}
                                </motion.text>

                                {/* Tooltip for hovered node */}
                                {hoveredNode === node.id && (
                                    <motion.g
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <rect
                                            x={node.x - 40}
                                            y={node.y - 50}
                                            width="80"
                                            height="25"
                                            rx="4"
                                            fill="rgba(0, 0, 0, 0.8)"
                                            className="pointer-events-none"
                                        />
                                        <text
                                            x={node.x}
                                            y={node.y - 35}
                                            textAnchor="middle"
                                            fontSize="11"
                                            fill="white"
                                            className="pointer-events-none"
                                        >
                                            {node.isLeaf 
                                                ? `Char: '${node.char}' (${node.freq})`
                                                : `Freq: ${node.freq}`
                                            }
                                        </text>
                                    </motion.g>
                                )}
                            </g>
                        ))}
                    </AnimatePresence>
                </svg>
            </div>

            {/* Legend and Information */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-4 p-4 rounded-lg border"
                style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border-default)' }}
            >
                <h5 className="font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                    Tree Information
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                        <span className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                            Total Nodes:
                        </span>
                        <span className="ml-2" style={{ color: 'var(--color-text-primary)' }}>
                            {nodePositions.length}
                        </span>
                    </div>
                    <div>
                        <span className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                            Leaf Nodes:
                        </span>
                        <span className="ml-2" style={{ color: 'var(--color-text-primary)' }}>
                            {nodePositions.filter(n => n.isLeaf).length}
                        </span>
                    </div>
                    <div>
                        <span className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                            Tree Height:
                        </span>
                        <span className="ml-2" style={{ color: 'var(--color-text-primary)' }}>
                            {Math.max(...nodePositions.map(n => n.level)) + 1}
                        </span>
                    </div>
                </div>
                
                {selectedNode && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-3 pt-3 border-t"
                        style={{ borderColor: 'var(--color-border-default)' }}
                    >
                        <div className="text-sm">
                            <span className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                                Selected Node:
                            </span>
                            <span className="ml-2" style={{ color: 'var(--color-text-primary)' }}>
                                {(() => {
                                    const node = nodePositions.find(n => n.id === selectedNode);
                                    if (node?.isLeaf) {
                                        return `Character '${node.char}' with frequency ${node.freq}`;
                                    }
                                    return `Internal node with frequency ${node?.freq || 'unknown'}`;
                                })()}
                            </span>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </motion.div>
    );
} 