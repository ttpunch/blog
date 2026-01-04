'use client';

import ArticleEditor from '@/components/blog/article-editor';
import OutlineReview from '@/components/blog/outline-review';
import { trpc } from '@/lib/trpc';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function EditArticlePage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const { data: article, isLoading, refetch } = trpc.article.getById.useQuery({ id }, {
        retry: false
    });

    // Poll if in transitional states
    trpc.ai.getArticleStatus.useQuery(
        { id },
        {
            enabled: !!article && ['QUEUED', 'PLANNING', 'WRITING', 'OPTIMIZING', 'RESEARCHING'].includes(article.status),
            refetchInterval: 3000,
            onSuccess: (data) => {
                // If status changes from transient to AWAITING_APPROVAL or REVIEW, refresh main data
                if (data && article && data.status !== article.status) {
                    refetch();
                }
            }
        }
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
            </div>
        );
    }

    if (!article) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
                <div className="p-4 bg-destructive/10 rounded-full text-destructive">
                    <AlertCircle className="w-12 h-12" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold">Article not found</h2>
                    <p className="text-muted-foreground">The article you're trying to edit doesn't exist or has been deleted.</p>
                </div>
                <Button asChild variant="outline">
                    <Link href="/dashboard/articles">Back to Articles</Link>
                </Button>
            </div>
        );
    }

    if (article.status === 'AWAITING_APPROVAL' && (article as any).outline) {
        return <OutlineReview articleId={article.id} initialOutline={(article as any).outline} />;
    }

    if (['QUEUED', 'PLANNING', 'WRITING', 'OPTIMIZING', 'RESEARCHING'].includes(article.status)) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-primary/20 animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                </div>
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold">AI Agent Working...</h2>
                    <p className="text-muted-foreground">Current Status: <span className="font-mono font-bold text-primary">{article.status}</span></p>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto">
            <ArticleEditor initialData={article} />
        </div>
    );
}
