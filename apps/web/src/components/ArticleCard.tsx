'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Heart, Hand } from "lucide-react";

interface ArticleCardProps {
    article: any;
    className?: string;
}

export function ArticleCard({ article, className }: ArticleCardProps) {
    const publishedDate = article.publishedAt
        ? new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return (
        <Link href={`/article/${article.slug}`} className={className}>
            <article className="group h-full flex flex-col overflow-hidden rounded-3xl border border-border/50 bg-card/60 backdrop-blur-xl relative transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_40px_hsl(292_84%_61%_/_0.12)] hover:-translate-y-0.5">

                {/* Hover glow */}
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-primary/5 via-transparent to-transparent" />

                {/* Cover image */}
                {article.coverImage ? (
                    <div className="relative aspect-[16/10] overflow-hidden shrink-0">
                        <Image
                            src={article.coverImage}
                            alt={article.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/20 to-transparent" />
                    </div>
                ) : (
                    /* Decorative placeholder when no cover image */
                    <div className="relative aspect-[16/10] overflow-hidden shrink-0 bg-gradient-to-br from-primary/5 to-accent/5">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-2xl border border-primary/20 bg-primary/5 flex items-center justify-center">
                                <span className="text-2xl font-black text-primary/30" style={{ fontFamily: 'var(--font-syne)' }}>
                                    {article.title?.[0] ?? 'A'}
                                </span>
                            </div>
                        </div>
                        {/* Decorative dots */}
                        <div
                            className="absolute inset-0 opacity-20"
                            style={{
                                backgroundImage: 'radial-gradient(hsl(292 84% 61% / 0.3) 1px, transparent 1px)',
                                backgroundSize: '20px 20px',
                            }}
                        />
                    </div>
                )}

                {/* Content */}
                <div className="flex flex-col flex-1 p-6">
                    {/* Meta row */}
                    <div className="flex items-center justify-between mb-4">
                        <Badge
                            variant="outline"
                            className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.15em] bg-primary/5 text-primary border-primary/20"
                        >
                            {article.category?.name ?? 'Knowledge'}
                        </Badge>
                        <div className="flex items-center gap-3 text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                            <span>{article.readingTime ?? 5} min</span>
                            <span>·</span>
                            <span>{publishedDate}</span>
                        </div>
                    </div>

                    {/* Title */}
                    <h2
                        className="text-xl font-bold leading-tight tracking-tight group-hover:text-primary transition-colors duration-200 line-clamp-2 mb-3"
                        style={{ fontFamily: 'var(--font-syne)' }}
                    >
                        {article.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
                        {article.excerpt ?? article.content?.replace(/<[^>]*>/g, '').substring(0, 140)}…
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-border/40">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5 text-muted-foreground/60 group/stat hover:text-rose-400 transition-colors">
                                <Heart className="w-3.5 h-3.5" />
                                <span className="text-xs font-semibold tabular-nums">{article._count?.likes ?? 0}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-muted-foreground/60 group/stat hover:text-amber-400 transition-colors">
                                <Hand className="w-3.5 h-3.5" />
                                <span className="text-xs font-semibold tabular-nums">{article.clapsCount ?? 0}</span>
                            </div>
                        </div>

                        <div className="w-8 h-8 rounded-full border border-border/50 bg-background/50 flex items-center justify-center text-muted-foreground group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-200">
                            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
}
