'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const FuturisticBackground = () => {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Fuchsia blob — top left */}
            <motion.div
                animate={{
                    scale: [1, 1.18, 1],
                    opacity: [0.18, 0.28, 0.18],
                    x: [0, 50, 0],
                    y: [0, -25, 0],
                }}
                transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full"
                style={{
                    background: 'radial-gradient(circle at center, hsl(292 84% 61% / 0.45) 0%, transparent 65%)',
                    filter: 'blur(90px)',
                }}
            />

            {/* Cyan blob — right */}
            <motion.div
                animate={{
                    scale: [1, 1.22, 1],
                    opacity: [0.12, 0.22, 0.12],
                    x: [0, -45, 0],
                    y: [0, 35, 0],
                }}
                transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-[5%] -right-[15%] w-[50%] h-[65%] rounded-full"
                style={{
                    background: 'radial-gradient(circle at center, hsl(188 83% 53% / 0.35) 0%, transparent 65%)',
                    filter: 'blur(100px)',
                }}
            />

            {/* Bottom fuchsia bloom */}
            <motion.div
                animate={{
                    scale: [1, 1.12, 1],
                    opacity: [0.08, 0.16, 0.08],
                    x: [0, 25, 0],
                    y: [0, 45, 0],
                }}
                transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-[0%] left-[20%] w-[40%] h-[40%] rounded-full"
                style={{
                    background: 'radial-gradient(circle at center, hsl(292 84% 61% / 0.3) 0%, transparent 65%)',
                    filter: 'blur(80px)',
                }}
            />

            {/* Dot grid */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: 'radial-gradient(hsl(240 5% 30% / 0.5) 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                    maskImage: 'radial-gradient(ellipse 90% 60% at 50% 0%, black 30%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(ellipse 90% 60% at 50% 0%, black 30%, transparent 100%)',
                }}
            />

            {/* Noise texture */}
            <div
                className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: '256px 256px',
                }}
            />
        </div>
    );
};
