'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

interface LikeButtonProps {
    articleId: string;
}

export function LikeButton({ articleId }: LikeButtonProps) {
    const utils = trpc.useContext();
    const { data: status, isLoading } = trpc.like.status.useQuery({ articleId });
    const likeMutation = trpc.like.toggle.useMutation({
        onMutate: async () => {
            // Optimistic update
            await utils.like.status.cancel({ articleId });
            const previousStatus = utils.like.status.getData({ articleId });

            if (previousStatus) {
                utils.like.status.setData({ articleId }, {
                    count: previousStatus.isLiked ? previousStatus.count - 1 : previousStatus.count + 1,
                    isLiked: !previousStatus.isLiked
                });
            }

            return { previousStatus };
        },
        onError: (err, variables, context) => {
            if (context?.previousStatus) {
                utils.like.status.setData({ articleId }, context.previousStatus);
            }
            toast.error('Failed to update like');
        },
        onSettled: () => {
            utils.like.status.invalidate({ articleId });
        },
    });

    const handleToggle = () => {
        likeMutation.mutate({ articleId });
    };

    return (
        <div className="flex items-center gap-2">
            <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={handleToggle}
                disabled={isLoading}
                className={cn(
                    "flex items-center justify-center p-2 rounded-full transition-colors relative",
                    status?.isLiked
                        ? "text-red-500 bg-red-500/10"
                        : "text-muted-foreground hover:bg-muted"
                )}
            >
                <Heart
                    className={cn(
                        "w-6 h-6",
                        status?.isLiked && "fill-current"
                    )}
                />

                <AnimatePresence>
                    {status?.isLiked && (
                        <motion.div
                            initial={{ scale: 0, opacity: 1 }}
                            animate={{ scale: 2, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-red-500 rounded-full"
                        />
                    )}
                </AnimatePresence>
            </motion.button>

            <span className="text-sm font-medium tabular-nums min-w-[1rem]">
                {status?.count ?? 0}
            </span>
        </div>
    );
}
