'use client';

import { trpc } from '@/lib/trpc';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import {
    Plus,
    Search,
    MoreHorizontal,
    Edit,
    Eye,
    Trash2,
    Filter,
    ArrowUpDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { cn } from '@/lib/utils';

export default function ArticlesPage() {
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    const { data: articles, isLoading } = trpc.article.adminList.useQuery({
        status: statusFilter === 'ALL' ? undefined : (statusFilter as any)
    });

    const utils = trpc.useContext();
    const deleteMutation = trpc.article.delete.useMutation({
        onSuccess: () => {
            utils.article.adminList.invalidate();
        },
    });

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this article? This action cannot be undone.')) return;

        try {
            await deleteMutation.mutateAsync({ id });
        } catch (error) {
            console.error('Failed to delete article:', error);
            alert('Failed to delete article. Please try again.');
        }
    };

    const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" | null | undefined => {
        switch (status) {
            case 'PUBLISHED': return 'default';
            case 'REVIEW': return 'secondary';
            case 'REJECTED': return 'destructive';
            case 'DRAFT': return 'outline';
            default: return 'outline';
        }
    };

    const filteredArticles = articles?.filter(a =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Articles</h1>
                    <p className="text-muted-foreground">Manage your blog content and publishing status.</p>
                </div>
                <Button asChild className="gap-2">
                    <Link href="/dashboard/articles/new">
                        <Plus className="w-4 h-4" />
                        New Article
                    </Link>
                </Button>
            </div>

            <Card className="border-border/50 shadow-sm">
                <CardHeader className="pb-3">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full md:w-auto">
                            <TabsList className="bg-muted/50">
                                <TabsTrigger value="ALL">All</TabsTrigger>
                                <TabsTrigger value="PUBLISHED">Published</TabsTrigger>
                                <TabsTrigger value="DRAFT">Drafts</TabsTrigger>
                                <TabsTrigger value="REVIEW">Review</TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search articles..."
                                className="pl-10 bg-muted/30 border-muted"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow>
                                <TableHead className="w-[40%] pl-6">Title</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead className="hidden lg:table-cell">Views</TableHead>
                                <TableHead className="hidden md:table-cell">Date</TableHead>
                                <TableHead className="text-right pr-6">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                            Loading articles...
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : filteredArticles?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                        No articles found matching your criteria.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredArticles?.map((article) => (
                                    <TableRow key={article.id} className="group hover:bg-muted/50 transition-colors">
                                        <TableCell className="pl-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                                    {article.title}
                                                </span>
                                                <span className="text-xs text-muted-foreground font-mono">/{article.slug}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusVariant(article.status)} className="capitalize">
                                                {article.status.toLowerCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm px-2 py-1 bg-muted rounded-md text-muted-foreground">
                                                {article.category?.name || 'Uncategorized'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell font-medium">
                                            {article.viewCount.toLocaleString()}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                                            {new Date(article.updatedAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/article/${article.slug}`} target="_blank" className="flex items-center">
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View Live
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/dashboard/articles/${article.id}/edit`} className="flex items-center">
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit Content
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(article.id)}
                                                        className="text-destructive focus:text-destructive"
                                                        disabled={deleteMutation.isLoading}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        {deleteMutation.isLoading ? 'Deleting...' : 'Delete'}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
