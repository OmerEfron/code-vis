'use client';

import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Line, Environment, Sky } from '@react-three/drei';
import * as THREE from 'three';

// Node component for 3D tree
function TreeNode({ node, position, isLeaf, path = '', onNodeClick }) {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);
    
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        }
    });

    const nodeColor = isLeaf ? '#10B981' : '#6366F1';
    const hoverColor = isLeaf ? '#059669' : '#4F46E5';

    return (
        <group position={position}>
            {/* Node sphere */}
            <mesh 
                ref={meshRef}
                onClick={() => onNodeClick?.(node)}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <sphereGeometry args={[0.5, 16, 16]} />
                <meshStandardMaterial 
                    color={hovered ? hoverColor : nodeColor}
                    metalness={0.2}
                    roughness={0.3}
                />
            </mesh>
            
            {/* Node label */}
            <Text
                position={[0, 0.8, 0]}
                fontSize={0.3}
                color="#1F2937"
                anchorX="center"
                anchorY="middle"
                font="/fonts/roboto.woff"
            >
                {isLeaf ? `'${node.char}'` : 'Internal'}
            </Text>
            
            {/* Frequency label */}
            <Text
                position={[0, -0.8, 0]}
                fontSize={0.25}
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
                    fontSize={0.2}
                    color="#3B82F6"
                    anchorX="center"
                    anchorY="middle"
                    font="/fonts/roboto.woff"
                >
                    Code: {path}
                </Text>
            )}
        </group>
    );
}

// Connection line between nodes
function Connection({ start, end, isLeft }) {
    const points = useMemo(() => {
        return [new THREE.Vector3(...start), new THREE.Vector3(...end)];
    }, [start, end]);

    return (
        <Line
            points={points}
            color={isLeft ? "#EF4444" : "#3B82F6"}
            lineWidth={3}
        />
    );
}

// Recursive function to build 3D tree structure
function build3DTree(node, x = 0, y = 0, z = 0, level = 0, path = '', onNodeClick) {
    if (!node) return null;

    const isLeaf = node.char !== null;
    const spacing = Math.max(8 / (level + 1), 1);
    const verticalSpacing = 3;

    const elements = [];
    
    // Add current node
    elements.push(
        <TreeNode
            key={`node-${x}-${y}-${level}`}
            node={node}
            position={[x, y, z]}
            isLeaf={isLeaf}
            path={path}
            onNodeClick={onNodeClick}
        />
    );

    // Add left child
    if (node.left) {
        const leftX = x - spacing;
        const leftY = y - verticalSpacing;
        const leftPath = path + '0';
        
        // Connection line
        elements.push(
            <Connection
                key={`left-conn-${x}-${y}-${level}`}
                start={[x, y - 0.5, z]}
                end={[leftX, leftY + 0.5, z]}
                isLeft={true}
            />
        );
        
        // Label for left edge
        elements.push(
            <Text
                key={`left-label-${x}-${y}-${level}`}
                position={[(x + leftX) / 2 - 0.3, (y + leftY) / 2, z]}
                fontSize={0.2}
                color="#EF4444"
                anchorX="center"
                anchorY="middle"
            >
                0
            </Text>
        );
        
        elements.push(...build3DTree(node.left, leftX, leftY, z, level + 1, leftPath, onNodeClick));
    }

    // Add right child
    if (node.right) {
        const rightX = x + spacing;
        const rightY = y - verticalSpacing;
        const rightPath = path + '1';
        
        // Connection line
        elements.push(
            <Connection
                key={`right-conn-${x}-${y}-${level}`}
                start={[x, y - 0.5, z]}
                end={[rightX, rightY + 0.5, z]}
                isLeft={false}
            />
        );
        
        // Label for right edge
        elements.push(
            <Text
                key={`right-label-${x}-${y}-${level}`}
                position={[(x + rightX) / 2 + 0.3, (y + rightY) / 2, z]}
                fontSize={0.2}
                color="#3B82F6"
                anchorX="center"
                anchorY="middle"
            >
                1
            </Text>
        );
        
        elements.push(...build3DTree(node.right, rightX, rightY, z, level + 1, rightPath, onNodeClick));
    }

    return elements;
}

// Scene component
function TreeScene({ tree, onNodeClick, autoRotate }) {
    return (
        <>
            <Sky 
                distance={450000}
                sunPosition={[0, 1, 0]}
                inclination={0}
                azimuth={0.25}
            />
            <Environment preset="city" />
            <fog attach="fog" args={['#ffffff', 10, 50]} />
            
            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 10, 10]} intensity={0.8} castShadow />
            <pointLight position={[-10, -10, -10]} intensity={0.3} />
            
            {tree && build3DTree(tree, 0, 0, 0, 0, '', onNodeClick)}
            
            <OrbitControls 
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={5}
                maxDistance={30}
                autoRotate={autoRotate}
                autoRotateSpeed={0.5}
                enableDamping={true}
                dampingFactor={0.05}
            />
        </>
    );
}

export default function TreeVisualization3D({ tree }) {
    const [selectedNode, setSelectedNode] = useState(null);
    const [autoRotate, setAutoRotate] = useState(false);

    const handleNodeClick = (node) => {
        setSelectedNode(node);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
                    3D Huffman Tree Structure
                </h4>
                <div className="flex gap-2">
                    <button
                        onClick={() => setAutoRotate(!autoRotate)}
                        className="px-3 py-1 text-sm rounded border"
                        style={{
                            backgroundColor: autoRotate ? 'var(--color-primary-500)' : 'var(--color-surface)',
                            color: autoRotate ? 'white' : 'var(--color-text-primary)',
                            borderColor: 'var(--color-border-default)'
                        }}
                    >
                        {autoRotate ? '⏸ Stop Rotation' : '🔄 Auto Rotate'}
                    </button>
                </div>
            </div>
            
            <div 
                className="border rounded-lg overflow-hidden"
                style={{ 
                    backgroundColor: 'var(--color-neutral-25)',
                    borderColor: 'var(--color-border-subtle)',
                    height: '600px'
                }}
            >
                <Canvas 
                    camera={{ position: [0, 5, 15], fov: 60 }}
                    shadows
                >
                    <TreeScene tree={tree} onNodeClick={handleNodeClick} autoRotate={autoRotate} />
                </Canvas>
            </div>

            {/* Controls and Legend */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded border" style={{ 
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border-default)'
                }}>
                    <h5 className="font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                        🎮 Controls
                    </h5>
                    <div className="space-y-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        <p>• <strong>Left Mouse:</strong> Rotate view</p>
                        <p>• <strong>Right Mouse:</strong> Pan camera</p>
                        <p>• <strong>Scroll:</strong> Zoom in/out</p>
                        <p>• <strong>Click Node:</strong> Select for details</p>
                    </div>
                </div>

                <div className="p-4 rounded border" style={{ 
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border-default)'
                }}>
                    <h5 className="font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                        🎨 Legend
                    </h5>
                    <div className="space-y-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        <p>• <span style={{ color: '#10B981' }}>●</span> Green spheres = Leaf nodes (characters)</p>
                        <p>• <span style={{ color: '#6366F1' }}>●</span> Blue spheres = Internal nodes</p>
                        <p>• <span style={{ color: '#EF4444' }}>—</span> Red lines = Left edges (0)</p>
                        <p>• <span style={{ color: '#3B82F6' }}>—</span> Blue lines = Right edges (1)</p>
                    </div>
                </div>
            </div>

            {/* Selected Node Details */}
            {selectedNode && (
                <div className="mt-4 p-4 rounded border" style={{ 
                    backgroundColor: 'var(--color-primary-50)',
                    borderColor: 'var(--color-primary-300)'
                }}>
                    <h5 className="font-medium mb-2" style={{ color: 'var(--color-primary-700)' }}>
                        📋 Selected Node Details
                    </h5>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <strong>Type:</strong> {selectedNode.char ? 'Leaf Node' : 'Internal Node'}
                        </div>
                        <div>
                            <strong>Frequency:</strong> {selectedNode.freq}
                        </div>
                        {selectedNode.char && (
                            <div>
                                <strong>Character:</strong> '{selectedNode.char}'
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="mt-4 p-4 rounded border-l-4" style={{ 
                backgroundColor: 'var(--color-primary-50)',
                borderLeftColor: 'var(--color-primary-500)'
            }}>
                <h6 className="font-medium mb-2" style={{ color: 'var(--color-primary-700)' }}>
                    🌳 3D Tree Navigation
                </h6>
                <p className="text-sm" style={{ color: 'var(--color-primary-600)' }}>
                    Explore the Huffman tree in 3D! Red paths (0) go left, blue paths (1) go right. 
                    The path from root to each leaf node gives you the binary code for that character.
                    Notice how frequently used characters are closer to the root (shorter paths).
                </p>
            </div>
        </div>
    );
} 