'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, animate } from 'framer-motion';
import { ArticleCard } from './ArticleCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface InfiniteCarouselProps {
    articles: any[];
}

export function InfiniteCarousel({ articles }: InfiniteCarouselProps) {
    const [isHovered, setIsHovered] = useState(false);

    // Config
    const cardWidth = 400;
    const gap = 32;
    const totalItemWidth = cardWidth + gap;
    const totalContentWidth = totalItemWidth * articles.length;

    // We render 3 sets to ensure we always have enough items visible during transitions
    // Set 1 (buffer) | Set 2 (main) | Set 3 (buffer)
    const duplicatedArticles = [...articles, ...articles, ...articles];

    // x is our continuous position. We'll animate this.
    const x = useMotionValue(0);

    // springX for smooth movement
    const springX = useSpring(x, { stiffness: 100, damping: 25, mass: 1 });

    // This is the magic: transform the continuous X into a wrapped visual position
    // We want the result to stay between -totalContentWidth and 0 (centered on Set 2 roughly)
    const displayX = useTransform(springX, (val) => {
        // Modulo math for negative numbers: ((n % m) + m) % m
        const wrapped = ((val % totalContentWidth) - totalContentWidth) % totalContentWidth;
        return wrapped;
    });

    const moveToIndex = (direction: number) => {
        const currentX = x.get();
        // Calculate nearest step
        const targetX = Math.round(currentX / totalItemWidth) * totalItemWidth + (direction * totalItemWidth);
        animate(x, targetX, {
            type: 'spring',
            stiffness: 100,
            damping: 20
        });
    };

    const moveNext = () => moveToIndex(-1);
    const movePrev = () => moveToIndex(1);

    // Auto-drift
    useEffect(() => {
        let frame: number;
        const drift = () => {
            if (!isHovered) {
                x.set(x.get() - 0.5);
            }
            frame = requestAnimationFrame(drift);
        };
        frame = requestAnimationFrame(drift);
        return () => cancelAnimationFrame(frame);
    }, [isHovered, x]);

    if (!articles || articles.length === 0) return null;

    return (
        <div
            className="relative w-full group py-12 select-none overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Viewport with modern blur mask */}
            <div className="relative w-full overflow-hidden">
                {/* Edge Blur Overlays - Very subtle edge-only effect */}
                <div className="absolute left-0 top-0 bottom-0 w-8 z-30 pointer-events-none bg-gradient-to-r from-background via-background/95 to-transparent backdrop-blur-[0.5px]" />
                <div className="absolute right-0 top-0 bottom-0 w-8 z-30 pointer-events-none bg-gradient-to-l from-background via-background/95 to-transparent backdrop-blur-[0.5px]" />

                {/* Track - We render 3 sets, but shift the second set into view */}
                <motion.div
                    drag="x"
                    style={{
                        x: displayX,
                    }}
                    className="flex gap-8 py-4 cursor-grab active:cursor-grabbing"
                    onDragStart={() => setIsHovered(true)}
                    onDrag={(e, info) => {
                        // Update our continuous X value based on drag delta
                        x.set(x.get() + info.delta.x);
                    }}
                    onDragEnd={(e, info) => {
                        const velocity = info.velocity.x;
                        if (Math.abs(velocity) > 500) {
                            const steps = Math.round(velocity / 1000) * 3;
                            moveToIndex(steps);
                        } else {
                            // Snap to nearest item
                            const currentX = x.get();
                            const targetPath = Math.round(currentX / totalItemWidth) * totalItemWidth;
                            animate(x, targetPath, {
                                type: 'spring',
                                stiffness: 200,
                                damping: 25
                            });
                        }
                    }}
                >
                    {duplicatedArticles.map((article, index) => (
                        <div
                            key={`${article.id}-${index}`}
                            className="w-[400px] shrink-0 transition-transform duration-500 hover:scale-[1.02]"
                        >
                            <ArticleCard article={article} />
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Navigation Buttons */}
            <div className="absolute left-8 top-1/2 -translate-y-1/2 z-40 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100">
                <button
                    onClick={movePrev}
                    className="p-6 rounded-full bg-white/5 border border-white/10 backdrop-blur-3xl hover:bg-primary/20 hover:border-primary/50 transition-all text-white shadow-[0_0_50px_rgba(0,0,0,0.3)] group/btn"
                >
                    <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
                </button>
            </div>

            <div className="absolute right-8 top-1/2 -translate-y-1/2 z-40 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100">
                <button
                    onClick={moveNext}
                    className="p-6 rounded-full bg-white/5 border border-white/10 backdrop-blur-3xl hover:bg-primary/20 hover:border-primary/50 transition-all text-white shadow-[0_0_50px_rgba(0,0,0,0.3)] group/btn"
                >
                    <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Pagination Indicators - Always showing the state of the "current" set */}
            <div className="flex justify-center items-center gap-12 mt-12 px-4">
                <div className="h-[1px] bg-gradient-to-r from-transparent to-white/10 flex-grow max-w-[150px]" />
                <div className="flex gap-4">
                    {articles.map((_, index) => (
                        <Indicator
                            key={index}
                            index={index}
                            x={x}
                            totalItemWidth={totalItemWidth}
                            totalArticles={articles.length}
                        />
                    ))}
                </div>
                <div className="h-[1px] bg-gradient-to-l from-transparent to-white/10 flex-grow max-w-[150px]" />
            </div>
        </div>
    );
}

function Indicator({ index, x, totalItemWidth, totalArticles }: { index: number, x: any, totalItemWidth: number, totalArticles: number }) {
    const width = useTransform(x, (latest: number) => {
        const normalizedX = ((-latest / totalItemWidth) % totalArticles + totalArticles) % totalArticles;
        const distance = Math.abs(normalizedX - index);
        const wrappedDistance = Math.min(distance, totalArticles - distance);
        return wrappedDistance < 0.5 ? 48 : 8;
    });

    const opacity = useTransform(x, (latest: number) => {
        const normalizedX = ((-latest / totalItemWidth) % totalArticles + totalArticles) % totalArticles;
        const distance = Math.abs(normalizedX - index);
        const wrappedDistance = Math.min(distance, totalArticles - distance);
        return wrappedDistance < 0.5 ? 1 : 0.2;
    });

    return (
        <motion.div
            style={{ width, opacity }}
            className="h-1 bg-primary rounded-full transition-colors duration-500"
        />
    );
}
