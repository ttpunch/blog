'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="p-2 w-10 h-10 rounded-full bg-secondary/50 backdrop-blur-sm" />;
    }

    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-3 rounded-full bg-secondary/50 hover:bg-primary/10 border border-primary/20 backdrop-blur-md shadow-lg shadow-primary/5 text-primary transition-colors relative group overflow-hidden"
            aria-label="Toggle theme"
        >
            <div className="relative z-10 w-4 h-4">
                {theme === 'dark' ? (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                    >
                        <Sun className="w-4 h-4" />
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                    >
                        <Moon className="w-4 h-4" />
                    </motion.div>
                )}
            </div>

            {/* Dynamic background effect */}
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300" />
            <div className="absolute -inset-1 bg-primary/20 blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.button>
    );
}
