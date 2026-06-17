'use client';

import { trpc } from '@/lib/trpc';
import {
    FileText,
    CheckSquare,
    ListTodo,
    TrendingUp,
    Plus,
    Sparkles,
    Clock,
    ArrowUpRight,
    Eye,
    Heart,
    Hand,
    MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
    const { data: articles } = trpc.article.adminList.useQuery({});
    const { data: queue } = trpc.queue.list.useQuery({});
    const { data: reviewQueue } = trpc.article.reviewQueue.useQuery();

    const publishedCount = articles?.filter((a) => a.status === 'PUBLISHED').length ?? 0;
    const draftCount = articles?.filter((a) => a.status !== 'PUBLISHED' && a.status !== 'REJECTED').length ?? 0;
    const reviewCount = reviewQueue?.length ?? 0;
    const queueCount = queue?.filter((q) => q.status === 'PENDING').length ?? 0;

    // Engagement totals (data already returned by adminList)
    const totalViews = articles?.reduce((sum, a) => sum + (a.viewCount ?? 0), 0) ?? 0;
    const totalLikes = articles?.reduce((sum, a) => sum + (a._count?.likes ?? 0), 0) ?? 0;
    const totalClaps = articles?.reduce((sum, a) => sum + ((a as any).clapsCount ?? 0), 0) ?? 0;
    const totalComments = articles?.reduce((sum, a) => sum + (a._count?.comments ?? 0), 0) ?? 0;

    const formatNum = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`);

    const engagementStats = [
        { title: 'Total Views', val: totalViews, icon: Eye, color: 'text-sky-500', bg: 'bg-sky-500/10' },
        { title: 'Likes', val: totalLikes, icon: Heart, color: 'text-rose-500', bg: 'bg-rose-500/10' },
        { title: 'Claps', val: totalClaps, icon: Hand, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        { title: 'Comments', val: totalComments, icon: MessageSquare, color: 'text-violet-500', bg: 'bg-violet-500/10' },
    ];

    const topArticles = [...(articles ?? [])]
        .filter((a) => a.status === 'PUBLISHED')
        .sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0))
        .slice(0, 5);

    const stats = [
        {
            title: 'Published',
            val: publishedCount,
            icon: FileText,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
            desc: 'Live on your blog'
        },
        {
            title: 'Drafts',
            val: draftCount,
            icon: FileText,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
            desc: 'Working in progress'
        },
        {
            title: 'Review Queue',
            val: reviewCount,
            icon: CheckSquare,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10',
            desc: 'Needs your attention',
            highlight: reviewCount > 0
        },
        {
            title: 'In Queue',
            val: queueCount,
            icon: ListTodo,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10',
            desc: 'Scheduled for AI'
        },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-extrabold tracking-tight">Overview</h1>
                <p className="text-muted-foreground text-lg">
                    Monitor your blog performance and AI content workflow.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className={cn(
                        "relative overflow-hidden border-border/50 transition-all hover:shadow-md",
                        stat.highlight && "border-amber-500/50 bg-amber-500/5"
                    )}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <div className={cn("p-2 rounded-lg", stat.bg)}>
                                <stat.icon className={cn("w-4 h-4", stat.color)} />
                            </div>
                        </CardHeader>
                        <CardContent className="px-4 pb-4">
                            <div className="text-2xl font-bold">{stat.val}</div>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                {stat.desc}
                            </p>
                        </CardContent>
                        {stat.highlight && (
                            <div className="absolute top-0 right-0 p-2">
                                <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                            </div>
                        )}
                    </Card>
                ))}
            </div>

            {/* Engagement Grid */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Engagement</h2>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {engagementStats.map((stat, i) => (
                        <Card key={i} className="border-border/50 transition-all hover:shadow-md">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                <div className={cn("p-2 rounded-lg", stat.bg)}>
                                    <stat.icon className={cn("w-4 h-4", stat.color)} />
                                </div>
                            </CardHeader>
                            <CardContent className="px-4 pb-4">
                                <div className="text-2xl font-bold tabular-nums">{formatNum(stat.val)}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Quick Actions */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Get started with content creation</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button asChild size="lg" className="w-full h-auto py-6 justify-start gap-4">
                            <Link href="/dashboard/articles/new">
                                <div className="p-2 bg-primary-foreground/10 rounded-lg">
                                    <Plus className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col items-start">
                                    <span className="font-bold">Write Article</span>
                                    <span className="text-xs font-normal opacity-80">Manual creation from scratch</span>
                                </div>
                            </Link>
                        </Button>
                        <Button asChild variant="secondary" size="lg" className="w-full h-auto py-6 justify-start gap-4 border border-primary/10">
                            <Link href="/dashboard/ai-writer">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col items-start text-foreground">
                                    <span className="font-bold">AI Generation</span>
                                    <span className="text-xs font-normal text-muted-foreground">Automated bulk content</span>
                                </div>
                                <ArrowUpRight className="w-4 h-4 ml-auto text-muted-foreground" />
                            </Link>
                        </Button>
                        {reviewCount > 0 && (
                            <Button asChild variant="outline" size="lg" className="w-full h-auto py-6 justify-start gap-4 md:col-span-2 border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10">
                                <Link href="/dashboard/review">
                                    <div className="p-2 bg-amber-500/20 rounded-lg text-amber-600">
                                        <CheckSquare className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col items-start text-foreground">
                                        <span className="font-bold">Review Pending Content</span>
                                        <span className="text-xs font-normal text-muted-foreground">You have {reviewCount} items waiting for approval</span>
                                    </div>
                                    <Badge variant="secondary" className="ml-auto bg-amber-500 text-white border-none">
                                        Action Required
                                    </Badge>
                                </Link>
                            </Button>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Activity Mini-Card (Placeholder logic for now) */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {articles?.slice(0, 4).map((a, i) => (
                            <div key={i} className="flex gap-4 items-start">
                                <div className={cn(
                                    "w-2 h-2 rounded-full mt-2 ring-4 ring-background",
                                    a.status === 'PUBLISHED' ? "bg-emerald-500 ring-emerald-500/20" : "bg-amber-500 ring-amber-500/20"
                                )} />
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-medium truncate leading-none mb-1">{a.title}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {a.status.toLowerCase()} • {new Date(a.updatedAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Top Performing Articles */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        Top Performing Articles
                    </CardTitle>
                    <CardDescription>Your most viewed published content</CardDescription>
                </CardHeader>
                <CardContent>
                    {topArticles.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-4">No published articles yet.</p>
                    ) : (
                        <div className="space-y-1">
                            {topArticles.map((a, i) => (
                                <Link
                                    key={a.id}
                                    href={`/dashboard/articles/${a.id}/edit`}
                                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                                >
                                    <span className="text-sm font-bold text-muted-foreground/50 w-5 tabular-nums">{i + 1}</span>
                                    <span className="text-sm font-medium truncate flex-1 group-hover:text-primary transition-colors">{a.title}</span>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground shrink-0">
                                        <span className="flex items-center gap-1 tabular-nums"><Eye className="w-3.5 h-3.5" />{formatNum(a.viewCount ?? 0)}</span>
                                        <span className="flex items-center gap-1 tabular-nums"><Heart className="w-3.5 h-3.5" />{a._count?.likes ?? 0}</span>
                                        <span className="flex items-center gap-1 tabular-nums"><Hand className="w-3.5 h-3.5" />{(a as any).clapsCount ?? 0}</span>
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0" />
                                </Link>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
