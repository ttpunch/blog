'use client';

import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { FormattedDate } from '@/components/blog/FormattedDate';
import { Trash2, MessageSquare, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { FuturisticBackground } from '@/components/ui/futuristic-background';

export default function CommentsManagementPage() {
    const utils = trpc.useContext();
    // Assuming we add an adminList procedure to comment router
    // For now, let's just use a placeholder or add it
    const { data: comments, isLoading } = trpc.comment.listAll?.useQuery() || { data: [], isLoading: true };

    const deleteMutation = trpc.comment.moderateDelete.useMutation({
        onSuccess: () => {
            utils.comment.listAll?.invalidate();
            toast.success('Comment deleted');
        }
    });

    if (isLoading) return <div className="p-8 animate-pulse space-y-4">
        {[1, 2, 3].map(i => <div key={i} className="h-32 bg-muted rounded-xl" />)}
    </div>;

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8 relative">
            <header className="flex justify-between items-center relative z-10">
                <div>
                    <h1 className="text-4xl font-black tracking-tight">Comment Moderation</h1>
                    <p className="text-muted-foreground">Manage and moderate user discussions across your articles.</p>
                </div>
                <div className="bg-primary/10 px-4 py-2 rounded-full border border-primary/20 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    <span className="text-sm font-bold text-primary">{comments?.length || 0} Total</span>
                </div>
            </header>

            <div className="grid gap-4 relative z-10">
                {comments?.map((comment: any) => (
                    <Card key={comment.id} className="bg-card/30 backdrop-blur-md border-white/5 overflow-hidden group">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="flex items-center gap-3">
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src={comment.user.image} />
                                    <AvatarFallback>{comment.user.name?.[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="text-sm font-bold">{comment.user.name}</div>
                                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">
                                        <FormattedDate date={comment.createdAt} />
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Link
                                    href={`/article/${comment.article.slug}`}
                                    target="_blank"
                                    className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => deleteMutation.mutate({ id: comment.id })}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm border-l-2 border-primary/20 pl-4 py-1 italic text-foreground/80">
                                "{comment.content}"
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Article:</span>
                                <Badge variant="outline" className="text-[10px] border-primary/20 text-primary">
                                    {comment.article.title}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {comments?.length === 0 && (
                    <div className="text-center py-24 border-2 border-dashed rounded-3xl border-white/5">
                        <p className="text-muted-foreground font-medium">No comments to moderate yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
