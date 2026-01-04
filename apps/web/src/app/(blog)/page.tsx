'use client';

import { trpc } from '@/lib/trpc';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from 'framer-motion';
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
        <main className="relative min-h-screen pb-24">
            <FuturisticBackground />



            <div className="container mx-auto px-4 pt-20 pb-16 relative z-10">
                <header className="mb-24 text-center space-y-6">
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
                        Exploring the <span className="text-primary italic">Future</span> of AI.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-muted-foreground text-lg md:text-2xl max-w-3xl mx-auto font-medium"
                    >
                        Deep dives into artificial intelligence, tech evolution, and the new economy.
                    </motion.p>
                </header>

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {articles?.items.map((article) => (
                        <motion.div key={article.id} variants={item}>
                            <Link href={`/article/${article.slug}`}>
                                <Card className="group h-full overflow-hidden border-white/5 transition-all hover:shadow-[0_0_40px_rgba(var(--primary),0.15)] hover:border-primary/30 bg-card/30 backdrop-blur-xl relative flex flex-col rounded-[2rem]">
                                    {article.coverImage && (
                                        <div className="relative aspect-[16/10] overflow-hidden">
                                            <img
                                                src={article.coverImage}
                                                alt={article.title}
                                                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        </div>
                                    )}
                                    <CardHeader className="p-8 pb-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <Badge variant="outline" className="px-3 py-1 bg-primary/5 text-primary border-primary/10 text-[10px] uppercase font-bold tracking-widest">
                                                {article.category?.name || 'Knowledge'}
                                            </Badge>
                                            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider opacity-60">
                                                {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                        <h2 className="text-2xl font-black leading-[1.2] group-hover:text-primary transition-colors line-clamp-2 tracking-tight">
                                            {article.title}
                                        </h2>
                                    </CardHeader>
                                    <CardContent className="px-8 pb-4 grow">
                                        <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                                            {article.excerpt || article.content.substring(0, 150)}...
                                        </p>
                                    </CardContent>
                                    <CardFooter className="p-8 pt-0 mt-auto">
                                        <div className="w-full flex items-center justify-between py-6 border-t border-white/5">
                                            <div className="flex items-center gap-6">
                                                <div className="flex items-center gap-1.5 text-muted-foreground group/stat">
                                                    <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center transition-colors group-hover/stat:bg-amber-500/10 group-hover/stat:text-amber-500">
                                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M11 20.3546L5.70711 15.0617C5.31658 14.6712 5.31658 14.038 5.70711 13.6475L12.5519 6.80277C12.893 6.46162 12.893 5.9085 12.5519 5.56735C12.2107 5.22621 11.6576 5.22621 11.3164 5.56735L6.64645 10.2374M13.5 17.8546L18.7929 12.5617C19.1834 12.1712 19.1834 11.538 18.7929 11.1475L11.9481 4.30277C11.6069 3.96162 11.6069 3.4085 11.9481 3.06735C12.2893 2.72621 12.8424 2.72621 13.1835 3.06735L17.8536 7.7374" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-sm font-bold tabular-nums">{article.clapsCount || 0}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-muted-foreground group/stat">
                                                    <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center transition-colors group-hover/stat:bg-red-500/10 group-hover/stat:text-red-500">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-sm font-bold tabular-nums">{(article as any)._count?.likes || 0}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-muted-foreground group/stat">
                                                    <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center transition-colors group-hover/stat:bg-blue-500/10 group-hover/stat:text-blue-500">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-sm font-bold tabular-nums">{(article as any)._count?.comments || 0}</span>
                                                </div>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground transition-all duration-300 transform group-hover:scale-110 shadow-lg shadow-primary/20">
                                                <ArrowRight className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </CardFooter>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>

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
