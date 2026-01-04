'use client';

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export const ReadingProgress = () => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-1.5 bg-primary origin-left z-50 shadow-[0_0_10px_rgba(var(--primary),0.5)]"
            style={{ scaleX }}
        >
            <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-r from-transparent to-white/30 blur-sm" />
        </motion.div>
    );
};
