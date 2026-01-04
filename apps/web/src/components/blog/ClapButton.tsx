"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc"; // Fixed import
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ClapButtonProps {
    articleId: string;
    initialTotalClaps?: number;
    initialUserClaps?: number;
    className?: string;
}

export function ClapButton({ articleId, initialTotalClaps = 0, initialUserClaps = 0, className }: ClapButtonProps) {
    const [totalClaps, setTotalClaps] = useState(initialTotalClaps);
    const [userClaps, setUserClaps] = useState(initialUserClaps);
    const [pendingClaps, setPendingClaps] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // TRPC
    const utils = trpc.useContext();
    const submitClap = trpc.clap.submit.useMutation({
        onMutate: async ({ amount }) => {
            // Already updated optimistically
        },
        onSuccess: (data) => {
            // Sync with server response if needed
        },
        onError: () => {
            // Revert if failed
            setTotalClaps(prev => prev - pendingClaps);
            setUserClaps(prev => prev - pendingClaps);
        }
    });

    // Debounce submission
    useEffect(() => {
        if (pendingClaps === 0) return;

        const timer = setTimeout(() => {
            submitClap.mutate({ articleId, amount: pendingClaps });
            setPendingClaps(0);
        }, 800);

        return () => clearTimeout(timer);
    }, [pendingClaps, articleId, submitClap]);

    const handleClap = () => {
        if (userClaps >= 50) return; // Max limit

        setTotalClaps(prev => prev + 1);
        setUserClaps(prev => prev + 1);
        setPendingClaps(prev => prev + 1);
    };

    return (
        <div className={cn("relative flex items-center gap-2", className)}>
            <div className="relative">
                <AnimatePresence>
                    {pendingClaps > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.5 }}
                            animate={{ opacity: 1, y: -50, scale: 1.2 }}
                            exit={{ opacity: 0, y: -70 }}
                            className="absolute -top-8 left-1/2 -translate-x-1/2 pointer-events-none z-20"
                        >
                            <div className="bg-gradient-to-tr from-primary to-blue-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-xl shadow-primary/20 flex flex-col items-center">
                                +{pendingClaps}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                        "rounded-full h-10 w-10 border-2 transition-all duration-300 relative overflow-hidden group",
                        userClaps > 0
                            ? "border-primary bg-primary/5 text-primary shadow-[0_0_20px_rgba(var(--primary),0.2)]"
                            : "border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5",
                        isHovered && "scale-105"
                    )}
                    onClick={handleClap}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    disabled={userClaps >= 50}
                >
                    <motion.div
                        whileTap={{ scale: 0.8 }}
                        className="relative z-10"
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill={userClaps > 0 ? "currentColor" : "none"}
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={cn("transition-all duration-300", userClaps > 0 ? "text-primary fill-primary/20" : "text-muted-foreground group-hover:text-primary")}
                        >
                            {/* Custom Clapping Hands Path */}
                            <path d="M11 20.3546L5.70711 15.0617C5.31658 14.6712 5.31658 14.038 5.70711 13.6475L12.5519 6.80277C12.893 6.46162 12.893 5.9085 12.5519 5.56735C12.2107 5.22621 11.6576 5.22621 11.3164 5.56735L6.64645 10.2374M13.5 17.8546L18.7929 12.5617C19.1834 12.1712 19.1834 11.538 18.7929 11.1475L11.9481 4.30277C11.6069 3.96162 11.6069 3.4085 11.9481 3.06735C12.2893 2.72621 12.8424 2.72621 13.1835 3.06735L17.8536 7.7374" />
                            <path d="M15.5 21C15.5 21 19 18.5 20.5 16C22 13.5 22 11.5 22 10C22 8.5 21 7.5 20 7.5C19 7.5 18 8 18 8" />
                            <path d="M9.5 21C9.5 21 6 18.5 4.5 16C3 13.5 3 11.5 3 10C3 8.5 4 7.5 5 7.5C6 7.5 7 8 7 8" />
                            {/* Simplified hands clapping style for clarity */}
                            <path d="M7 11c.5-3 2.5-6 5-6s4.5 3 5 6" />
                            <path d="M12 21a9 9 0 0 1-9-9" />
                            <path d="M12 21a9 9 0 0 0 9-9" />
                        </svg>
                    </motion.div>
                </Button>
            </div>
            <span className="text-sm font-bold text-muted-foreground tabular-nums select-none">{totalClaps}</span>
        </div>
    );
}
