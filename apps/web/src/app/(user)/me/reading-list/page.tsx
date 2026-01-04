'use client';

import { trpc } from '@/lib/trpc';
import Link from 'next/link';
import { Bookmark, Clock, MessageSquare, Heart, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { FormattedDate } from '@/components/blog/FormattedDate';

export default function ReadingListPage() {
    const { data: bookmarks, isLoading } = trpc.bookmark.list.useQuery();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!bookmarks || bookmarks.length === 0) {
        return (
            <div className="text-center py-20 px-4">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                    <Bookmark className="w-10 h-10 text-muted-foreground" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Your reading list is empty</h1>
                <p className="text-muted-foreground max-w-md mx-auto mb-8">
                    Articles you save for later will appear here. Start exploring and save some articles!
                </p>
                <Button asChild>
                    <Link href="/">Browse Articles</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="border-b pb-8">
                <h1 className="text-4xl font-extrabold tracking-tight mb-2">Reading List</h1>
                <p className="text-xl text-muted-foreground font-medium">
                    Articles you've saved to read later.
                </p>
            </div>

            <div className="grid gap-6">
                {bookmarks.map((bookmark: any, index: number) => {
                    const { article } = bookmark;
                    return (
                        <motion.div
                            key={bookmark.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card className="overflow-hidden group hover:border-primary/50 transition-all border-border/50 bg-card/30 backdrop-blur-sm">
                                <div className="flex flex-col md:flex-row">
                                    <div className="w-full md:w-72 h-48 md:h-auto relative overflow-hidden shrink-0">
                                        <img
                                            src={article.coverImage || '/placeholder.png'}
                                            alt={article.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                                    </div>
                                    <CardContent className="p-8 flex-1">
                                        <div className="flex flex-col h-full justify-between">
                                            <div>
                                                <div className="flex items-center gap-3 mb-4">
                                                    {article.category && (
                                                        <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-bold">
                                                            {article.category.name}
                                                        </Badge>
                                                    )}
                                                    <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {article.readingTime || 5} min read
                                                    </span>
                                                </div>
                                                <Link href={`/article/${article.slug}`} className="block group/title">
                                                    <h3 className="text-2xl font-bold mb-3 group-hover/title:text-primary transition-colors leading-tight">
                                                        {article.title}
                                                    </h3>
                                                </Link>
                                                <p className="text-muted-foreground line-clamp-2 text-base mb-6 leading-relaxed">
                                                    {article.excerpt}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between pt-6 border-t border-border/50">
                                                <div className="flex items-center gap-5">
                                                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-medium">
                                                        <Heart className="w-4 h-4 text-red-500/70" />
                                                        {article._count.likes}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-medium">
                                                        <MessageSquare className="w-4 h-4 text-blue-500/70" />
                                                        {article._count.comments}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-medium text-muted-foreground/60">
                                                        <Eye className="w-4 h-4" />
                                                        {article.viewCount}
                                                    </div>
                                                </div>
                                                <div className="text-xs font-bold text-muted-foreground/40 tracking-wider">
                                                    SAVED ON <FormattedDate date={bookmark.createdAt} />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </div>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
