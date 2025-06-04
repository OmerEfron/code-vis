'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Line, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Enhanced Node component with progressive highlighting
function ProgressiveNode({ node, position, isLeaf, path = '', onNodeClick, isNew = false, depth = 0 }) {
    const meshRef = useRef();
    const glowRef = useRef();
    const [hovered, setHovered] = useState(false);
    const [scale, setScale] = useState(isNew ? 0 : 1);
    
    useFrame((state, delta) => {
        if (meshRef.current) {
            // Gentle rotation for all nodes
            meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3 + depth) * 0.1;
            
            // Scale animation for new nodes
            if (isNew && scale < 1) {
                setScale(prev => Math.min(prev + delta * 3, 1));
                meshRef.current.scale.setScalar(scale);
            }
            
            // Glow effect for new nodes
            if (glowRef.current && isNew) {
                glowRef.current.material.opacity = Math.sin(state.clock.elapsedTime * 4) * 0.3 + 0.4;
            }
        }
    });

    const nodeColor = isLeaf ? '#10B981' : isNew ? '#F59E0B' : '#6366F1';
    const hoverColor = isLeaf ? '#059669' : isNew ? '#D97706' : '#4F46E5';

    return (
        <group position={position}>
            {/* Glow effect for new nodes */}
            {isNew && (
                <mesh ref={glowRef}>
                    <sphereGeometry args={[0.8, 16, 16]} />
                    <meshBasicMaterial 
                        color="#FCD34D" 
                        transparent 
                        opacity={0.5}
                    />
                </mesh>
            )}
            
            {/* Main node sphere */}
            <mesh 
                ref={meshRef}
                onClick={() => onNodeClick?.(node)}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <sphereGeometry args={[0.5, 16, 16]} />
                <meshStandardMaterial 
                    color={hovered ? hoverColor : nodeColor}
                    metalness={0.3}
                    roughness={0.2}
                    emissive={isNew ? '#FCD34D' : '#000000'}
                    emissiveIntensity={isNew ? 0.2 : 0}
                />
            </mesh>
            
            {/* Node status indicator */}
            {isNew && (
                <mesh position={[0.7, 0.7, 0]}>
                    <sphereGeometry args={[0.15, 8, 8]} />
                    <meshBasicMaterial color="#EF4444" />
                </mesh>
            )}
            
            {/* Node label */}
            <Text
                position={[0, 1, 0]}
                fontSize={0.25}
                color="#1F2937"
                anchorX="center"
                anchorY="middle"
                font="/fonts/roboto.woff"
            >
                {isLeaf ? `'${node.char}'` : isNew ? 'NEW' : 'Node'}
            </Text>
            
            {/* Frequency label */}
            <Text
                position={[0, -0.8, 0]}
                fontSize={0.2}
                color="#6B7280"
                anchorX="center"
                anchorY="middle"
                font="/fonts/roboto.woff"
            >
                Freq: {node.freq}
            </Text>
            
            {/* Code path label for leaf nodes */}
            {isLeaf && path && (
                <Text
                    position={[0, -1.2, 0]}
                    fontSize={0.15}
                    color="#3B82F6"
                    anchorX="center"
                    anchorY="middle"
                    font="/fonts/roboto.woff"
                >
                    Code: {path}
                </Text>
            )}
            
            {/* Depth indicator */}
            <Text
                position={[0, 1.4, 0]}
                fontSize={0.15}
                color="#9CA3AF"
                anchorX="center"
                anchorY="middle"
            >
                Level {depth}
            </Text>
        </group>
    );
}

// Enhanced connection line with animation
function ProgressiveConnection({ start, end, isLeft, isNew = false }) {
    const lineRef = useRef();
    const [progress, setProgress] = useState(isNew ? 0 : 1);
    
    useFrame((state, delta) => {
        if (isNew && progress < 1) {
            setProgress(prev => Math.min(prev + delta * 2, 1));
        }
    });

    const points = useMemo(() => {
        const startVec = new THREE.Vector3(...start);
        const endVec = new THREE.Vector3(...end);
        const currentEnd = startVec.clone().lerp(endVec, progress);
        return [startVec, currentEnd];
    }, [start, end, progress]);

    const color = isNew ? "#F59E0B" : (isLeft ? "#EF4444" : "#3B82F6");

    return (
        <Line
            ref={lineRef}
            points={points}
            color={color}
            lineWidth={isNew ? 5 : 3}
        />
    );
}

// Build 3D tree with progressive highlighting
function buildProgressiveTree(node, x = 0, y = 0, z = 0, level = 0, path = '', onNodeClick, currentStep = 2, visitedNodes = new Set()) {
    if (!node) return [];

    const isLeaf = node.char !== null;
    const spacing = Math.max(6 / (level + 1), 1.5);
    const verticalSpacing = 2.5;
    const nodeId = `${node.char || 'internal'}-${node.freq}-${x}-${y}`;
    
    // Determine if this node is new based on the current step
    const isNew = currentStep === 3 && !visitedNodes.has(nodeId);
    if (isNew) visitedNodes.add(nodeId);

    const elements = [];
    
    // Add current node
    elements.push(
        <ProgressiveNode
            key={`node-${nodeId}`}
            node={node}
            position={[x, y, z]}
            isLeaf={isLeaf}
            path={path}
            onNodeClick={onNodeClick}
            isNew={isNew}
            depth={level}
        />
    );

    // Add left child
    if (node.left) {
        const leftX = x - spacing;
        const leftY = y - verticalSpacing;
        const leftPath = path + '0';
        const leftNodeId = `${node.left.char || 'internal'}-${node.left.freq}-${leftX}-${leftY}`;
        const leftIsNew = currentStep === 3 && !visitedNodes.has(leftNodeId);
        
        // Connection line
        elements.push(
            <ProgressiveConnection
                key={`left-conn-${nodeId}`}
                start={[x, y - 0.5, z]}
                end={[leftX, leftY + 0.5, z]}
                isLeft={true}
                isNew={leftIsNew}
            />
        );
        
        // Edge label
        elements.push(
            <Text
                key={`left-label-${nodeId}`}
                position={[(x + leftX) / 2 - 0.2, (y + leftY) / 2, z]}
                fontSize={0.15}
                color="#EF4444"
                anchorX="center"
                anchorY="middle"
            >
                0
            </Text>
        );
        
        elements.push(...buildProgressiveTree(node.left, leftX, leftY, z, level + 1, leftPath, onNodeClick, currentStep, visitedNodes));
    }

    // Add right child
    if (node.right) {
        const rightX = x + spacing;
        const rightY = y - verticalSpacing;
        const rightPath = path + '1';
        const rightNodeId = `${node.right.char || 'internal'}-${node.right.freq}-${rightX}-${rightY}`;
        const rightIsNew = currentStep === 3 && !visitedNodes.has(rightNodeId);
        
        // Connection line
        elements.push(
            <ProgressiveConnection
                key={`right-conn-${nodeId}`}
                start={[x, y - 0.5, z]}
                end={[rightX, rightY + 0.5, z]}
                isLeft={false}
                isNew={rightIsNew}
            />
        );
        
        // Edge label
        elements.push(
            <Text
                key={`right-label-${nodeId}`}
                position={[(x + rightX) / 2 + 0.2, (y + rightY) / 2, z]}
                fontSize={0.15}
                color="#3B82F6"
                anchorX="center"
                anchorY="middle"
            >
                1
            </Text>
        );
        
        elements.push(...buildProgressiveTree(node.right, rightX, rightY, z, level + 1, rightPath, onNodeClick, currentStep, visitedNodes));
    }

    return elements;
}

// Scene component with educational enhancements
function ProgressiveTreeScene({ tree, onNodeClick, currentStep, autoRotate }) {
    return (
        <>
            <Environment preset="dawn" />
            <fog attach="fog" args={['#f0f9ff', 8, 20]} />
            
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 10]} intensity={0.7} castShadow />
            <pointLight position={[-5, 5, 5]} intensity={0.4} color="#FCD34D" />
            
            {/* Educational annotations */}
            <Text
                position={[0, 4, 0]}
                fontSize={0.4}
                color="#1F2937"
                anchorX="center"
                anchorY="middle"
                font="/fonts/roboto.woff"
            >
                Progressive Huffman Tree
            </Text>
            
            <Text
                position={[0, 3.5, 0]}
                fontSize={0.2}
                color="#6B7280"
                anchorX="center"
                anchorY="middle"
            >
                Watch how the tree grows step by step
            </Text>
            
            {tree && buildProgressiveTree(tree, 0, 0, 0, 0, '', onNodeClick, currentStep)}
            
            <OrbitControls 
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={4}
                maxDistance={15}
                autoRotate={autoRotate}
                autoRotateSpeed={0.3}
                enableDamping={true}
                dampingFactor={0.08}
                maxPolarAngle={Math.PI / 1.8}
            />
        </>
    );
}

export default function ProgressiveTree3D({ tree, currentStep = 2, highlightNew = true }) {
    const [selectedNode, setSelectedNode] = useState(null);
    const [autoRotate, setAutoRotate] = useState(true);

    console.log('ProgressiveTree3D received:', { tree, currentStep, highlightNew });

    const handleNodeClick = (node) => {
        setSelectedNode(node);
    };

    // Calculate tree statistics
    const getTreeStats = () => {
        if (!tree) return { maxDepth: 0, nodeCount: 0, leafCount: 0 };
        
        const calculateStats = (node, depth = 0) => {
            if (!node) return { maxDepth: 0, nodeCount: 0, leafCount: 0 };
            
            if (node.char !== null) {
                return { maxDepth: depth, nodeCount: 1, leafCount: 1 };
            }
            
            const left = calculateStats(node.left, depth + 1);
            const right = calculateStats(node.right, depth + 1);
            
            return {
                maxDepth: Math.max(left.maxDepth, right.maxDepth),
                nodeCount: 1 + left.nodeCount + right.nodeCount,
                leafCount: left.leafCount + right.leafCount
            };
        };
        
        return calculateStats(tree);
    };

    const stats = getTreeStats();
    console.log('Tree stats:', stats);

    if (!tree) {
        console.log('No tree data, showing placeholder');
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-3">🌱</div>
                    <h5 className="font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                        Tree Building Phase
                    </h5>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        The tree will appear here as we start building it in the next steps.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full">
            <div className="h-4/5">
                <Canvas 
                    camera={{ position: [0, 3, 8], fov: 60 }}
                    style={{ background: 'linear-gradient(to bottom, #f0f9ff, #e0f2fe)' }}
                >
                    <ProgressiveTreeScene 
                        tree={tree} 
                        onNodeClick={handleNodeClick} 
                        currentStep={currentStep}
                        autoRotate={autoRotate}
                    />
                </Canvas>
            </div>

            {/* Controls and Information */}
            <div className="h-1/5 p-2 space-y-2">
                <div className="flex justify-between items-center">
                    <button
                        onClick={() => setAutoRotate(!autoRotate)}
                        className="px-2 py-1 text-xs rounded border"
                        style={{
                            backgroundColor: autoRotate ? 'var(--color-primary-500)' : 'var(--color-surface)',
                            color: autoRotate ? 'white' : 'var(--color-text-primary)',
                            borderColor: 'var(--color-border-default)'
                        }}
                    >
                        {autoRotate ? '⏸' : '🔄'}
                    </button>
                    
                    <div className="text-xs text-center" style={{ color: 'var(--color-text-tertiary)' }}>
                        Step {currentStep} Tree State
                    </div>
                </div>

                {/* Tree statistics */}
                <div className="text-xs space-y-1" style={{ color: 'var(--color-text-secondary)' }}>
                    <div className="flex justify-between">
                        <span>Depth:</span>
                        <span>{stats.maxDepth}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Nodes:</span>
                        <span>{stats.nodeCount}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Characters:</span>
                        <span>{stats.leafCount}</span>
                    </div>
                </div>

                {/* Legend */}
                <div className="text-xs space-y-1" style={{ color: 'var(--color-text-tertiary)' }}>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#10B981' }}></div>
                        <span>Characters</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#6366F1' }}></div>
                        <span>Internal Nodes</span>
                    </div>
                    {highlightNew && currentStep === 3 && (
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#F59E0B' }}></div>
                            <span>New Nodes</span>
                        </div>
                    )}
                </div>

                {/* Selected node info */}
                {selectedNode && (
                    <div className="text-xs p-2 rounded" style={{ 
                        backgroundColor: 'var(--color-primary-50)',
                        borderColor: 'var(--color-primary-300)'
                    }}>
                        <div className="font-medium">
                            {selectedNode.char ? `'${selectedNode.char}'` : 'Internal Node'}
                        </div>
                        <div>Frequency: {selectedNode.freq}</div>
                    </div>
                )}
            </div>
        </div>
    );
} 