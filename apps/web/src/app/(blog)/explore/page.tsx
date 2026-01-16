'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { ArticleCard } from '@/components/ArticleCard';
import { FuturisticBackground } from '@/components/ui/futuristic-background';
import { motion } from 'framer-motion';
import { Search, Filter, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ExplorePage() {
    const [searchQuery, setSearchQuery] = useState('');
    const { data: articles, isLoading } = trpc.article.list.useQuery({
        limit: 50, // Fetch more for explore page
    });

    const filteredArticles = articles?.items.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <main className="relative min-h-screen pt-24 pb-16 overflow-hidden">
            <FuturisticBackground />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-6xl font-black tracking-tighter mb-4"
                        >
                            Explore
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-muted-foreground text-lg"
                        >
                            Discover the latest thinking in Artificial Intelligence.
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-3 w-full md:w-auto"
                    >
                        <div className="relative flex-1 md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search articles..."
                                className="pl-10 bg-white/5 border-white/10 focus:bg-white/10 transition-colors rounded-full h-12"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" size="icon" className="rounded-full h-12 w-12 border-white/10 bg-white/5 hover:bg-white/10">
                            <Filter className="w-4 h-4" />
                        </Button>
                    </motion.div>
                </div>

                {/* Content Grid */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : filteredArticles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredArticles.map((article, index) => (
                            <motion.div
                                key={article.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <ArticleCard article={article} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-card/20 backdrop-blur-md rounded-[3rem] border border-dashed border-white/10">
                        <p className="text-muted-foreground text-xl font-medium">
                            No articles found matching "{searchQuery}"
                        </p>
                        <Button
                            variant="link"
                            className="mt-2 text-primary"
                            onClick={() => setSearchQuery('')}
                        >
                            Clear search
                        </Button>
                    </div>
                )}
            </div>
        </main>
    );
}
