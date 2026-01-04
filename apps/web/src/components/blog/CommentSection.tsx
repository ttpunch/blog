'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'react-hot-toast';
import { FormattedDate } from './FormattedDate';
import { MessageSquare, Reply, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CommentSectionProps {
    articleId: string;
}

export function CommentSection({ articleId }: CommentSectionProps) {
    const { data: session } = useSession();
    const utils = trpc.useContext();
    const { data: comments, isLoading } = trpc.comment.list.useQuery({ articleId });
    const [content, setContent] = useState('');
    const [replyTo, setReplyTo] = useState<string | null>(null);

    const createMutation = trpc.comment.create.useMutation({
        onSuccess: () => {
            setContent('');
            setReplyTo(null);
            utils.comment.list.invalidate({ articleId });
            toast.success('Comment posted!');
        },
        onError: (err) => {
            toast.error(err.message);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) {
            toast.error('You must be logged in to comment');
            return;
        }
        createMutation.mutate({
            articleId,
            content,
            parentId: replyTo || undefined,
        });
    };

    if (isLoading) return <div className="space-y-4 animate-pulse">
        <div className="h-24 bg-muted rounded-lg" />
        <div className="h-12 bg-muted rounded-lg w-1/2" />
    </div>;

    return (
        <section className="mt-12 space-y-8 border-t pt-8">
            <div className="flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Comments ({comments?.length || 0})</h2>
            </div>

            {session ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-4">
                        <Avatar>
                            <AvatarImage src={session.user?.image || ''} />
                            <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                            <Textarea
                                placeholder={replyTo ? "Write a reply..." : "Add to the discussion..."}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="min-h-[100px] resize-none focus-visible:ring-primary"
                            />
                            <div className="flex justify-between items-center">
                                {replyTo && (
                                    <Button variant="ghost" size="sm" onClick={() => setReplyTo(null)}>
                                        Cancel Reply
                                    </Button>
                                )}
                                <Button
                                    type="submit"
                                    disabled={createMutation.isLoading || !content.trim()}
                                    className="ml-auto"
                                >
                                    {replyTo ? "Post Reply" : "Post Comment"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="bg-muted/50 p-6 rounded-xl border border-dashed text-center space-y-3">
                    <p className="text-muted-foreground text-sm uppercase tracking-wider font-semibold">Join the conversation</p>
                    <p>Please log in to post a comment.</p>
                    <Button onClick={() => window.location.href = '/login'} variant="outline">
                        Login / Sign Up
                    </Button>
                </div>
            )}

            <div className="space-y-6">
                <AnimatePresence initial={false}>
                    {comments?.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            articleId={articleId}
                            onReply={(id) => {
                                setReplyTo(id);
                                document.querySelector('textarea')?.focus();
                            }}
                        />
                    ))}
                </AnimatePresence>
                {comments?.length === 0 && (
                    <p className="text-center text-muted-foreground py-8 italic">No comments yet. Be the first to share your thoughts!</p>
                )}
            </div>
        </section>
    );
}

function CommentItem({ comment, articleId, onReply }: { comment: any, articleId: string, onReply: (id: string) => void }) {
    const { data: session } = useSession();
    const utils = trpc.useContext();
    const deleteMutation = trpc.comment.delete.useMutation({
        onSuccess: () => {
            utils.comment.list.invalidate({ articleId });
            toast.success('Comment deleted');
        }
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4 group"
        >
            <Avatar className="w-10 h-10 border-2 border-background shadow-sm">
                <AvatarImage src={comment.user.image} />
                <AvatarFallback>{comment.user.name?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{comment.user.name}</span>
                    <span className="text-xs text-muted-foreground">
                        <FormattedDate date={comment.createdAt} />
                    </span>
                </div>
                <div className="text-[15px] leading-relaxed text-foreground/90 bg-muted/30 p-3 rounded-2xl rounded-tl-none border border-muted">
                    {comment.content}
                </div>
                <div className="flex items-center gap-4 pt-1">
                    <button
                        onClick={() => onReply(comment.id)}
                        className="text-xs flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors font-medium"
                    >
                        <Reply className="w-3 h-3" /> Reply
                    </button>
                    {(session?.user as any)?.id === comment.userId && (
                        <button
                            onClick={() => deleteMutation.mutate({ id: comment.id })}
                            className="text-xs flex items-center gap-1 text-muted-foreground hover:text-destructive transition-colors font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 className="w-3 h-3" /> Delete
                        </button>
                    )}
                </div>

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 space-y-4 border-l-2 pl-6 ml-1 py-1">
                        {comment.replies.map((reply: any) => (
                            <div key={reply.id} className="flex gap-3">
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src={reply.user.image} />
                                    <AvatarFallback>{reply.user.name?.[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-xs">{reply.user.name}</span>
                                        <span className="text-[10px] text-muted-foreground">
                                            <FormattedDate date={reply.createdAt} />
                                        </span>
                                    </div>
                                    <div className="text-sm bg-muted/20 p-2 rounded-xl border border-muted/50">
                                        {reply.content}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
