'use client';

import { trpc } from '@/lib/trpc';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import {
    CheckCircle2,
    XCircle,
    Edit3,
    Sparkles,
    Clock,
    User,
    ArrowRight,
    MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function ReviewQueuePage() {
    const { data: articles, isLoading, refetch } = trpc.article.reviewQueue.useQuery();
    const approveMutation = trpc.article.approve.useMutation();
    const rejectMutation = trpc.article.reject.useMutation();

    const handleApprove = async (id: string) => {
        await approveMutation.mutateAsync({ id });
        refetch();
    };

    const handleReject = async (id: string) => {
        if (!confirm('Are you sure you want to reject this article?')) return;
        await rejectMutation.mutateAsync({ id });
        refetch();
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-extrabold tracking-tight">Review Queue</h1>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-none">
                        {articles?.length || 0} Pending
                    </Badge>
                </div>
                <p className="text-muted-foreground text-lg">
                    Approve or refine AI-generated articles before they go live.
                </p>
            </div>

            {isLoading ? (
                <div className="grid gap-6">
                    {[1, 2].map((i) => (
                        <Card key={i} className="animate-pulse border-border/50">
                            <div className="h-48 bg-muted/50 w-full" />
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid gap-8">
                    {articles?.length === 0 ? (
                        <Card className="border-dashed border-2 bg-muted/30">
                            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="p-4 bg-background rounded-full mb-4 shadow-sm">
                                    <Sparkles className="w-8 h-8 text-primary/40" />
                                </div>
                                <CardTitle className="mb-2">All Caught Up!</CardTitle>
                                <CardDescription className="max-w-xs mx-auto">
                                    No articles are waiting for review. You can generate more using the AI Writer.
                                </CardDescription>
                                <Button asChild variant="outline" className="mt-6 border-primary/20 hover:bg-primary/5">
                                    <Link href="/dashboard/ai-writer">Go to AI Writer</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        articles?.map((article) => (
                            <Card key={article.id} className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader className="pb-4">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="space-y-1">
                                            <CardTitle className="text-2xl font-bold leading-tight group">
                                                <Link href={`/dashboard/articles/${article.id}/edit`} className="hover:text-primary transition-colors">
                                                    {article.title}
                                                </Link>
                                            </CardTitle>
                                            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground pt-1">
                                                <span className="flex items-center gap-1">
                                                    <Badge variant="outline" className="font-normal bg-muted/30">
                                                        {article.category?.name || 'Uncategorized'}
                                                    </Badge>
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {article.readingTime} min read
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                                                    {article.aiModel || 'GPT-4'}
                                                </span>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 px-3 py-1">
                                            Under Review
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="pb-6">
                                    <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                                        <p className="text-muted-foreground leading-relaxed line-clamp-3 italic">
                                            "{article.excerpt || 'No excerpt available.'}"
                                        </p>
                                    </div>
                                </CardContent>
                                <Separator />
                                <CardFooter className="bg-muted/10 p-4 flex flex-col sm:flex-row gap-3">
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => handleApprove(article.id)}
                                            className="bg-emerald-600 hover:bg-emerald-700 shadow-sm gap-2"
                                            disabled={approveMutation.isLoading}
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
                                            Approve & Publish
                                        </Button>
                                        <Button asChild variant="outline" className="gap-2">
                                            <Link href={`/dashboard/articles/${article.id}/edit`}>
                                                <Edit3 className="w-4 h-4" />
                                                Edit
                                            </Link>
                                        </Button>
                                    </div>
                                    <Button
                                        onClick={() => handleReject(article.id)}
                                        variant="ghost"
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10 sm:ml-auto gap-2"
                                        disabled={rejectMutation.isLoading}
                                    >
                                        <XCircle className="w-4 h-4" />
                                        Reject
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
