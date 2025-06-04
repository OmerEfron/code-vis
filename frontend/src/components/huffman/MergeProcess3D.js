'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';

// Animated node component
function AnimatedNode({ node, position, color, scale = 1, onComplete }) {
    const meshRef = useRef();
    const [currentScale, setCurrentScale] = useState(0);
    
    useFrame((state, delta) => {
        if (meshRef.current) {
            // Smooth scale animation
            if (currentScale < scale) {
                setCurrentScale(prev => Math.min(prev + delta * 2, scale));
                meshRef.current.scale.setScalar(currentScale);
            }
            
            // Gentle rotation
            meshRef.current.rotation.y += delta * 0.5;
        }
    });

    useEffect(() => {
        if (currentScale >= scale && onComplete) {
            onComplete();
        }
    }, [currentScale, scale, onComplete]);

    return (
        <group position={position}>
            {/* Node sphere */}
            <mesh ref={meshRef}>
                <sphereGeometry args={[0.8, 16, 16]} />
                <meshStandardMaterial 
                    color={color}
                    metalness={0.3}
                    roughness={0.2}
                />
            </mesh>
            
            {/* Node type label */}
            <Text
                position={[0, 1.5, 0]}
                fontSize={0.4}
                color="#1F2937"
                anchorX="center"
                anchorY="middle"
            >
                {node.char ? `'${node.char}'` : 'Internal'}
            </Text>
            
            {/* Frequency label */}
            <Text
                position={[0, -1.5, 0]}
                fontSize={0.3}
                color="#4B5563"
                anchorX="center"
                anchorY="middle"
            >
                Freq: {node.freq}
            </Text>
        </group>
    );
}

// Animated connection line
function AnimatedConnection({ start, end, progress = 0, color = "#10B981" }) {
    const lineRef = useRef();
    
    useFrame(() => {
        if (lineRef.current && progress > 0) {
            const startVec = new THREE.Vector3(...start);
            const endVec = new THREE.Vector3(...end);
            const currentEnd = startVec.lerp(endVec, Math.min(progress, 1));
            
            const points = [startVec, currentEnd];
            lineRef.current.geometry.setFromPoints(points);
        }
    });

    return (
        <line ref={lineRef}>
            <bufferGeometry />
            <lineBasicMaterial color={color} linewidth={5} />
        </line>
    );
}

// Plus symbol component
function PlusSymbol({ position, scale = 1, visible = true }) {
    const groupRef = useRef();
    
    useFrame((state) => {
        if (groupRef.current && visible) {
            groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.1;
            groupRef.current.scale.setScalar(scale);
        }
    });

    if (!visible) return null;

    return (
        <group ref={groupRef} position={position}>
            {/* Horizontal bar */}
            <mesh>
                <boxGeometry args={[2, 0.2, 0.2]} />
                <meshStandardMaterial color="#F59E0B" />
            </mesh>
            {/* Vertical bar */}
            <mesh>
                <boxGeometry args={[0.2, 2, 0.2]} />
                <meshStandardMaterial color="#F59E0B" />
            </mesh>
        </group>
    );
}

// Arrow component
function Arrow({ start, end, visible = true }) {
    if (!visible) return null;
    
    const direction = new THREE.Vector3(...end).sub(new THREE.Vector3(...start));
    const length = direction.length();
    direction.normalize();
    
    return (
        <group>
            {/* Arrow line */}
            <mesh position={[
                (start[0] + end[0]) / 2,
                (start[1] + end[1]) / 2,
                (start[2] + end[2]) / 2
            ]}>
                <cylinderGeometry args={[0.05, 0.05, length, 8]} />
                <meshStandardMaterial color="#DC2626" />
            </mesh>
            
            {/* Arrow head */}
            <mesh position={end}>
                <coneGeometry args={[0.2, 0.5, 8]} />
                <meshStandardMaterial color="#DC2626" />
            </mesh>
        </group>
    );
}

// Scene component
function MergeScene({ data, step }) {
    const leftPos = [-4, 0, 0];
    const rightPos = [4, 0, 0];
    const parentPos = [0, 3, 0];
    const plusPos = [0, 0, 0];

    return (
        <>
            <ambientLight intensity={0.7} />
            <pointLight position={[10, 10, 10]} intensity={0.8} />
            <pointLight position={[-10, 10, -10]} intensity={0.4} />
            <spotLight position={[0, 15, 5]} angle={0.3} penumbra={1} intensity={0.6} />
            
            {/* Left node */}
            <AnimatedNode
                node={data.left}
                position={leftPos}
                color="#3B82F6"
                scale={step >= 1 ? 1 : 0}
            />
            
            {/* Plus symbol */}
            <PlusSymbol 
                position={plusPos}
                visible={step >= 2}
                scale={step >= 2 ? 1 : 0}
            />
            
            {/* Right node */}
            <AnimatedNode
                node={data.right}
                position={rightPos}
                color="#EF4444"
                scale={step >= 1 ? 1 : 0}
            />
            
            {/* Arrow */}
            <Arrow 
                start={[2, 0, 0]}
                end={[-1, 2.5, 0]}
                visible={step >= 3}
            />
            
            {/* Parent node */}
            <AnimatedNode
                node={data.parent}
                position={parentPos}
                color="#10B981"
                scale={step >= 4 ? 1 : 0}
            />
            
            {/* Connection lines */}
            {step >= 4 && (
                <>
                    <Line
                        points={[leftPos, parentPos]}
                        color="#6B7280"
                        lineWidth={3}
                    />
                    <Line
                        points={[rightPos, parentPos]}
                        color="#6B7280"
                        lineWidth={3}
                    />
                </>
            )}
            
            {/* Labels for left and right */}
            {step >= 2 && (
                <>
                    <Text
                        position={[-4, -2.5, 0]}
                        fontSize={0.3}
                        color="#3B82F6"
                        anchorX="center"
                        anchorY="middle"
                    >
                        Left Child
                    </Text>
                    <Text
                        position={[4, -2.5, 0]}
                        fontSize={0.3}
                        color="#EF4444"
                        anchorX="center"
                        anchorY="middle"
                    >
                        Right Child
                    </Text>
                </>
            )}
            
            {/* Parent label */}
            {step >= 4 && (
                <Text
                    position={[0, 5, 0]}
                    fontSize={0.4}
                    color="#10B981"
                    anchorX="center"
                    anchorY="middle"
                >
                    New Parent Node
                </Text>
            )}
            
            <OrbitControls 
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={8}
                maxDistance={20}
                autoRotate={false}
            />
        </>
    );
}

export default function MergeProcess3D({ data }) {
    const [animationStep, setAnimationStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    
    useEffect(() => {
        if (isPlaying && animationStep < 4) {
            const timer = setTimeout(() => {
                setAnimationStep(prev => prev + 1);
            }, 1500);
            return () => clearTimeout(timer);
        } else if (animationStep >= 4) {
            setIsPlaying(false);
        }
    }, [isPlaying, animationStep]);

    const resetAnimation = () => {
        setAnimationStep(0);
        setIsPlaying(false);
    };

    const playAnimation = () => {
        if (animationStep >= 4) {
            resetAnimation();
        }
        setIsPlaying(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
                    3D Node Merging Process
                </h4>
                <div className="flex gap-2">
                    <button
                        onClick={playAnimation}
                        className="px-4 py-2 rounded font-medium text-white"
                        style={{ backgroundColor: 'var(--color-primary-500)' }}
                    >
                        {animationStep >= 4 ? '🔄 Replay' : isPlaying ? '⏸ Pause' : '▶ Play Animation'}
                    </button>
                    <button
                        onClick={resetAnimation}
                        className="px-3 py-2 rounded border"
                        style={{
                            backgroundColor: 'var(--color-surface)',
                            borderColor: 'var(--color-border-default)',
                            color: 'var(--color-text-primary)'
                        }}
                    >
                        🔄 Reset
                    </button>
                </div>
            </div>
            
            <div 
                className="border rounded-lg overflow-hidden"
                style={{ 
                    backgroundColor: 'var(--color-neutral-25)',
                    borderColor: 'var(--color-border-subtle)',
                    height: '500px'
                }}
            >
                <Canvas 
                    camera={{ position: [0, 5, 12], fov: 60 }}
                    style={{ background: 'linear-gradient(to bottom, #f3f4f6, #e5e7eb)' }}
                >
                    <MergeScene data={data} step={animationStep} />
                </Canvas>
            </div>

            {/* Animation Progress */}
            <div className="mt-4 p-4 rounded border" style={{ 
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border-default)'
            }}>
                <h5 className="font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>
                    Animation Progress
                </h5>
                <div className="flex items-center gap-4 mb-3">
                    {[
                        'Show Nodes',
                        'Add Plus Symbol',
                        'Show Merge Arrow',
                        'Create Parent Node'
                    ].map((step, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div 
                                className="w-4 h-4 rounded-full border-2"
                                style={{
                                    backgroundColor: animationStep > index ? 'var(--color-success-500)' : 'transparent',
                                    borderColor: animationStep > index ? 'var(--color-success-500)' : 'var(--color-border-default)'
                                }}
                            />
                            <span className="text-sm" style={{ 
                                color: animationStep > index ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)'
                            }}>
                                {step}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                            width: `${(animationStep / 4) * 100}%`,
                            backgroundColor: 'var(--color-primary-500)'
                        }}
                    />
                </div>
            </div>

            {/* Step-by-step explanation */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded border" style={{ 
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border-default)'
                }}>
                    <h5 className="font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                        🎯 Current Merge Operation
                    </h5>
                    <div className="space-y-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        <p><strong>Left Node:</strong> {data.left.char ? `'${data.left.char}'` : 'Internal'} (freq: {data.left.freq})</p>
                        <p><strong>Right Node:</strong> {data.right.char ? `'${data.right.char}'` : 'Internal'} (freq: {data.right.freq})</p>
                        <p><strong>Result:</strong> New parent with frequency {data.parent.freq}</p>
                    </div>
                </div>

                <div className="p-4 rounded border" style={{ 
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border-default)'
                }}>
                    <h5 className="font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                        🎮 3D Controls
                    </h5>
                    <div className="space-y-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        <p>• <strong>Rotate:</strong> Click and drag</p>
                        <p>• <strong>Zoom:</strong> Mouse wheel</p>
                        <p>• <strong>Pan:</strong> Right-click and drag</p>
                        <p>• <strong>Animation:</strong> Play/Pause/Reset controls</p>
                    </div>
                </div>
            </div>

            <div className="mt-4 p-4 rounded border-l-4" style={{ 
                backgroundColor: 'var(--color-primary-50)',
                borderLeftColor: 'var(--color-primary-500)'
            }}>
                <h6 className="font-medium mb-2" style={{ color: 'var(--color-primary-700)' }}>
                    🔄 Understanding the Merge Process
                </h6>
                <p className="text-sm" style={{ color: 'var(--color-primary-600)' }}>
                    Watch how two nodes with the lowest frequencies are combined into a new parent node. 
                    The parent's frequency is the sum of its children ({data.left.freq} + {data.right.freq} = {data.parent.freq}). 
                    This process continues until we have a single root node, forming the complete Huffman tree!
                </p>
            </div>
        </div>
    );
} 