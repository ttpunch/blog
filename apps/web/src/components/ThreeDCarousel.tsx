'use client';

import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, useCursor } from '@react-three/drei';
import * as THREE from 'three';
import { ArticleCard } from './ArticleCard';
import { motion, AnimatePresence } from 'framer-motion';

interface ThreeDCarouselProps {
    articles: any[];
}

function CarouselItem({ article, index, total, radius, rotation }: { article: any, index: number, total: number, radius: number, rotation: number }) {
    const angle = (index / total) * Math.PI * 2 + rotation;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;

    // Calculate scale and opacity based on Z position (depth)
    const depth = (z + radius) / (2 * radius); // 0 (back) to 1 (front)
    const scale = 0.5 + depth * 0.4; // Scaled down to max 0.9 per user request to prevent clipping
    const opacity = 0.1 + depth * 0.9; // Opacity from 0.1 (back) to 1.0 (front)

    return (
        <group position={[x, 0, z]}>
            <Html
                transform
                distanceFactor={10}
                position={[0, 0, 0.1]}
                style={{
                    transition: 'all 0.5s ease-out',
                    opacity: opacity,
                    transform: `scale(${scale})`,
                    pointerEvents: depth > 0.8 ? 'auto' : 'none', // Only front card is fully interactive
                    width: '400px',
                    height: 'auto'
                }}
            >
                <div
                    className="w-[400px] select-none"
                    style={{
                        filter: `blur(${(1 - depth) * 4}px)`,
                    }}
                >
                    <ArticleCard article={article} />
                </div>
            </Html>
        </group>
    );
}


function Scene({ articles, rotationVelocity }: { articles: any[], rotationVelocity: React.MutableRefObject<number> }) {
    const [rotation, setRotation] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const lastMouseX = useRef(0);
    const radius = 8; // Adjusted to 8 per user request

    useFrame(() => {
        if (!isDragging) {
            // Apply current velocity to rotation
            setRotation((prev) => {
                let nextRotation = prev + rotationVelocity.current;

                // Base friction
                rotationVelocity.current *= 0.95;

                if (articles.length > 0) {
                    const anglePerCard = (Math.PI * 2) / articles.length;

                    // Find the Snap Target
                    // We look ahead slightly to find the "intended" target based on velocity
                    const lookAhead = rotationVelocity.current * 10;
                    const snapTarget = Math.round((nextRotation + lookAhead) / anglePerCard) * anglePerCard;

                    const dist = snapTarget - nextRotation;

                    // Engage PD controller when getting closer or slower
                    // This threshold ensures we don't snap while spinning fast
                    if (Math.abs(rotationVelocity.current) < 0.05 || Math.abs(dist) < 0.5) {

                        // Tuned for Critical Damping
                        // kP (Spring) = Pull force
                        // kD (Damping) = Resistance to prevent overshoot
                        // Critical Damping ~ 2 * sqrt(kP) assuming mass=1.
                        // If kP = 0.05, sqrt(0.05) ~ 0.22, 2*0.22 = 0.44.
                        // So kD should be around 0.35 for a smooth landing.

                        const kP = 0.05;
                        const kD = 0.35;

                        const acceleration = (dist * kP) - (rotationVelocity.current * kD);

                        rotationVelocity.current += acceleration;

                        // Hard stop to prevent micro-jitter at equilibrium
                        if (Math.abs(dist) < 0.001 && Math.abs(rotationVelocity.current) < 0.001) {
                            rotationVelocity.current = 0;
                            nextRotation = snapTarget;
                        }
                    }
                }

                return nextRotation;
            });
        }
    });

    const handlePointerDown = (e: React.PointerEvent) => {
        setIsDragging(true);
        lastMouseX.current = e.clientX;
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (isDragging) {
            const deltaX = e.clientX - lastMouseX.current;
            const moveSpeed = 0.005;
            rotationVelocity.current = deltaX * moveSpeed;
            setRotation((prev) => prev + rotationVelocity.current);
            lastMouseX.current = e.clientX;
        }
    };

    const handlePointerUp = () => {
        setIsDragging(false);
    };

    return (
        <group
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
        >
            {articles.map((article, index) => (
                <CarouselItem
                    key={article.id}
                    article={article}
                    index={index}
                    total={articles.length}
                    radius={radius}
                    rotation={rotation}
                />
            ))}
        </group>
    );
}

export function ThreeDCarousel({ articles }: ThreeDCarouselProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const rotationVelocity = useRef(0);

    // Add native wheel event listener with passive: false to prevent page scroll
    React.useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            const delta = e.deltaY * 0.0005;
            rotationVelocity.current += delta;
        };

        container.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            container.removeEventListener('wheel', handleWheel);
        };
    }, []);

    if (!articles || articles.length === 0) return null;

    return (
        <div
            ref={containerRef}
            className="w-full h-[1000px] cursor-grab active:cursor-grabbing relative z-20"
        >
            <Canvas
                camera={{ position: [0, 0, 24], fov: 50 }}
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 2]}
            >
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <Scene articles={articles} rotationVelocity={rotationVelocity} />
            </Canvas>

            {/* Legend/Hint */}
            <div className="absolute  left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50 pointer-events-none">
                <svg className="w-3 h-3 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                Use scroll wheel to rotate
            </div>
        </div>
    );
}
