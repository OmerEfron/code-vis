'use client';

import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box } from '@react-three/drei';
import * as THREE from 'three';

// 3D Bar component for frequency visualization
function FrequencyBar({ char, frequency, position, maxFreq, totalFreq, onBarClick }) {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);
    
    const height = (frequency / maxFreq) * 6 + 0.5; // Scale height based on frequency
    const baseColor = '#3B82F6';
    const hoverColor = '#1D4ED8';
    
    useFrame((state) => {
        if (meshRef.current && hovered) {
            meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
        }
    });

    return (
        <group position={position}>
            {/* Base platform */}
            <mesh position={[0, -0.1, 0]}>
                <boxGeometry args={[1.2, 0.1, 1.2]} />
                <meshStandardMaterial color="#E5E7EB" />
            </mesh>
            
            {/* Frequency bar */}
            <mesh 
                ref={meshRef}
                position={[0, height / 2, 0]}
                onClick={() => onBarClick?.(char, frequency)}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <boxGeometry args={[1, height, 1]} />
                <meshStandardMaterial 
                    color={hovered ? hoverColor : baseColor}
                    metalness={0.3}
                    roughness={0.2}
                />
            </mesh>
            
            {/* Character label */}
            <Text
                position={[0, -0.5, 0]}
                fontSize={0.4}
                color="#1F2937"
                anchorX="center"
                anchorY="middle"
                rotation={[-Math.PI / 2, 0, 0]}
            >
                '{char}'
            </Text>
            
            {/* Frequency value on top of bar */}
            <Text
                position={[0, height + 0.3, 0]}
                fontSize={0.3}
                color="#374151"
                anchorX="center"
                anchorY="middle"
            >
                {frequency}
            </Text>
            
            {/* Percentage label */}
            <Text
                position={[0, height + 0.7, 0]}
                fontSize={0.2}
                color="#6B7280"
                anchorX="center"
                anchorY="middle"
            >
                {((frequency / totalFreq) * 100).toFixed(1)}%
            </Text>
        </group>
    );
}

// Grid floor component
function GridFloor() {
    const gridRef = useRef();
    
    return (
        <mesh ref={gridRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
            <planeGeometry args={[20, 20]} />
            <meshBasicMaterial color="#F9FAFB" transparent opacity={0.5} />
        </mesh>
    );
}

// Scene component
function FrequencyScene({ data, onBarClick }) {
    const entries = Object.entries(data).sort(([,a], [,b]) => b - a);
    const maxFreq = Math.max(...Object.values(data));
    const totalFreq = Object.values(data).reduce((sum, freq) => sum + freq, 0);
    
    // Position bars in a circular arrangement
    const bars = entries.map(([char, freq], index) => {
        const angle = (index / entries.length) * Math.PI * 2;
        const radius = Math.max(entries.length * 0.5, 3);
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        return (
            <FrequencyBar
                key={char}
                char={char}
                frequency={freq}
                position={[x, 0, z]}
                maxFreq={maxFreq}
                totalFreq={totalFreq}
                onBarClick={(char, freq) => onBarClick(char, freq, totalFreq)}
            />
        );
    });

    return (
        <>
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={0.8} />
            <pointLight position={[-10, 10, -10]} intensity={0.4} />
            <spotLight position={[0, 15, 0]} angle={0.3} penumbra={1} intensity={0.5} />
            
            <GridFloor />
            {bars}
            
            {/* Title in 3D space */}
            <Text
                position={[0, 8, 0]}
                fontSize={1}
                color="#1F2937"
                anchorX="center"
                anchorY="middle"
                font="/fonts/roboto.woff"
            >
                Character Frequencies
            </Text>
            
            <OrbitControls 
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={8}
                maxDistance={25}
                autoRotate={true}
                autoRotateSpeed={1}
                maxPolarAngle={Math.PI / 2.2}
            />
        </>
    );
}

export default function FrequencyChart3D({ data, inputString }) {
    const [selectedChar, setSelectedChar] = useState(null);
    const [autoRotate, setAutoRotate] = useState(true);
    
    const totalChars = Object.values(data).reduce((sum, freq) => sum + freq, 0);
    const maxFreq = Math.max(...Object.values(data));

    const handleBarClick = (char, frequency, total) => {
        setSelectedChar({
            char,
            frequency,
            percentage: ((frequency / total) * 100).toFixed(1)
        });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
                    3D Character Frequency Analysis
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
            
            <div className="mb-4 p-4 rounded" style={{ backgroundColor: 'var(--color-neutral-50)' }}>
                <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                    <strong>Input String:</strong> "{inputString}"
                </p>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    <strong>Total Characters:</strong> {totalChars} | <strong>Unique Characters:</strong> {Object.keys(data).length}
                </p>
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
                    camera={{ position: [12, 8, 12], fov: 60 }}
                    style={{ background: 'linear-gradient(to bottom, #dbeafe, #bfdbfe)' }}
                >
                    <FrequencyScene 
                        data={data} 
                        onBarClick={handleBarClick}
                    />
                </Canvas>
            </div>

            {/* Controls and Information */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded border" style={{ 
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border-default)'
                }}>
                    <h5 className="font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                        🎮 3D Visualization Controls
                    </h5>
                    <div className="space-y-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        <p>• <strong>Mouse Drag:</strong> Rotate around the chart</p>
                        <p>• <strong>Mouse Wheel:</strong> Zoom in/out</p>
                        <p>• <strong>Right Click + Drag:</strong> Pan view</p>
                        <p>• <strong>Click Bar:</strong> View character details</p>
                        <p>• <strong>Auto Rotate:</strong> Automatic 360° rotation</p>
                    </div>
                </div>

                <div className="p-4 rounded border" style={{ 
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border-default)'
                }}>
                    <h5 className="font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                        📊 Quick Stats
                    </h5>
                    <div className="space-y-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        <p>• <strong>Highest Frequency:</strong> {maxFreq} occurrences</p>
                        <p>• <strong>Characters Arranged:</strong> Circular layout</p>
                        <p>• <strong>Bar Height:</strong> Proportional to frequency</p>
                        <p>• <strong>Color Coding:</strong> Blue bars with hover effects</p>
                    </div>
                </div>
            </div>

            {/* Selected Character Details */}
            {selectedChar && (
                <div className="mt-4 p-4 rounded border" style={{ 
                    backgroundColor: 'var(--color-success-50)',
                    borderColor: 'var(--color-success-300)'
                }}>
                    <h5 className="font-medium mb-2" style={{ color: 'var(--color-success-700)' }}>
                        🎯 Selected Character: '{selectedChar.char}'
                    </h5>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                            <strong>Frequency:</strong> {selectedChar.frequency}
                        </div>
                        <div>
                            <strong>Percentage:</strong> {selectedChar.percentage}%
                        </div>
                        <div>
                            <strong>Rank:</strong> {Object.entries(data)
                                .sort(([,a], [,b]) => b - a)
                                .findIndex(([char]) => char === selectedChar.char) + 1} of {Object.keys(data).length}
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-4 p-4 rounded border-l-4" style={{ 
                backgroundColor: 'var(--color-primary-50)',
                borderLeftColor: 'var(--color-primary-500)'
            }}>
                <h6 className="font-medium mb-2" style={{ color: 'var(--color-primary-700)' }}>
                    📈 Understanding Frequency Analysis
                </h6>
                <p className="text-sm" style={{ color: 'var(--color-primary-600)' }}>
                    This 3D visualization shows how often each character appears in your text. 
                    Taller bars represent more frequent characters. In Huffman coding, 
                    frequently used characters get shorter binary codes, making compression more efficient!
                </p>
            </div>
        </div>
    );
} 