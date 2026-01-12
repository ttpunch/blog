'use client';

import { trpc } from '@/lib/trpc';
import { ThreeDCarousel } from '@/components/ThreeDCarousel';
import { ArticleCard } from '@/components/ArticleCard';
import { motion } from 'framer-motion';
import { Sparkles } from "lucide-react";
import { FuturisticBackground } from '@/components/ui/futuristic-background';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function HomePage() {
    const { data: articles, isLoading } = trpc.article.list.useQuery({
        limit: 10,
    });

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-24 relative">
                <FuturisticBackground />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-[400px] rounded-3xl bg-card/20 backdrop-blur-md border border-white/5 animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <main className="relative min-h-screen pb-24 overflow-x-hidden">
            <FuturisticBackground />

            <div className="container mx-auto px-4 pt-20 pb-16 relative z-10">
                <header className="mb-12 text-center space-y-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest backdrop-blur-sm shadow-lg shadow-primary/5"
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        Intelligence Driven Insights
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-8xl font-black tracking-tighter text-foreground leading-[0.9] text-balance"
                    >
                        Exploring the <span className="text-primary italic">Future</span> with AI.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-muted-foreground text-lg md:text-2xl max-w-3xl mx-auto font-medium"
                    >
                        Emerging Trends Across AI and Modern Technology.
                    </motion.p>
                </header>

                {/* 3D Carousel (Desktop) / Grid (Mobile) */}
                <div className="relative min-h-[960px]">
                    <div className="hidden lg:block mt-12">
                        <ThreeDCarousel articles={articles?.items || []} />
                    </div>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-8"
                    >
                        {articles?.items.map((article) => (
                            <motion.div
                                key={article.id}
                                variants={item}
                            >
                                <ArticleCard article={article} />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {articles?.items.length === 0 && !isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-32 bg-card/20 backdrop-blur-md rounded-[3rem] border border-dashed border-white/10"
                    >
                        <p className="text-muted-foreground text-xl font-medium">
                            The collective is currently processing new data.
                        </p>
                        <p className="text-muted-foreground/50 text-sm mt-2">Check back in a cycle.</p>
                    </motion.div>
                )}
            </div>
        </main>
    );
}
