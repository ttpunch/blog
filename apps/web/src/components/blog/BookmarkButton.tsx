'use client';

import { motion } from 'framer-motion';
import { Bookmark } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';

interface BookmarkButtonProps {
    articleId: string;
}

export function BookmarkButton({ articleId }: BookmarkButtonProps) {
    const { data: session, status: authStatus } = useSession();
    const utils = trpc.useContext();
    const { data: status, isLoading } = trpc.bookmark.status.useQuery({ articleId });

    const bookmarkMutation = trpc.bookmark.toggle.useMutation({
        onMutate: async () => {
            // Optimistic update
            await utils.bookmark.status.cancel({ articleId });
            const previousStatus = utils.bookmark.status.getData({ articleId });

            if (previousStatus) {
                utils.bookmark.status.setData({ articleId }, {
                    bookmarked: !previousStatus.bookmarked
                });
            }

            return { previousStatus };
        },
        onSuccess: (data) => {
            toast.success(data.bookmarked ? 'Saved for later' : 'Removed from reading list');
        },
        onError: (err, variables, context) => {
            if (context?.previousStatus) {
                utils.bookmark.status.setData({ articleId }, context.previousStatus);
            }
            console.error('Bookmark toggle failed:', err);
            toast.error(err.message || 'Failed to update bookmark');
        },
        onSettled: () => {
            utils.bookmark.status.invalidate({ articleId });
            utils.bookmark.list.invalidate();
        },
    });

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!session) {
            toast.error('Please log in to save articles');
            return;
        }

        if (isLoading || bookmarkMutation.isLoading) return;

        bookmarkMutation.mutate({ articleId });
    };

    return (
        <div className="flex items-center gap-2">
            <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={handleToggle}
                disabled={isLoading}
                className={cn(
                    "flex items-center justify-center p-2 rounded-full transition-colors relative",
                    status?.bookmarked
                        ? "text-blue-500 bg-blue-500/10"
                        : "text-muted-foreground hover:bg-muted"
                )}
                title={status?.bookmarked ? "Remove from reading list" : "Save for later"}
            >
                <Bookmark
                    className={cn(
                        "w-6 h-6",
                        status?.bookmarked && "fill-current"
                    )}
                />
            </motion.button>
        </div>
    );
}
