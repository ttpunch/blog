'use client';

import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

interface ArticleCardProps {
    article: any;
    className?: string;
}

export function ArticleCard({ article, className }: ArticleCardProps) {
    return (
        <Link href={`/article/${article.slug}`} className={className}>
            <Card className="group h-full overflow-hidden border-white/10 transition-all hover:shadow-[0_0_50px_rgba(var(--primary),0.3)] hover:border-primary/40 bg-card/40 backdrop-blur-xl relative flex flex-col rounded-[2.5rem] shadow-2xl shadow-black/50">
                {/* Sheen effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-20">
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                </div>

                {article.coverImage && (
                    <div className="relative aspect-[16/10] overflow-hidden shrink-0">
                        <img
                            src={article.coverImage}
                            alt={article.title}
                            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                    </div>
                )}
                <div className="flex flex-col grow">
                    <CardHeader className="p-7 pb-4">
                        <div className="flex items-center justify-between mb-4">
                            <Badge variant="outline" className="px-3 py-1 bg-primary/5 text-primary border-primary/20 text-[10px] uppercase font-black tracking-[0.2em]">
                                {article.category?.name || 'Knowledge'}
                            </Badge>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">
                                    {article.readingTime || 5} MIN READ
                                </span>
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">
                                    {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                            </div>
                        </div>
                        <h2 className="text-2xl font-black leading-[1.2] group-hover:text-primary transition-colors line-clamp-2 tracking-tighter">
                            {article.title}
                        </h2>
                    </CardHeader>
                    <CardContent className="px-7 pb-4 grow">
                        <p className="text-muted-foreground text-base line-clamp-3 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity font-medium">
                            {article.excerpt || article.content.substring(0, 150)}...
                        </p>
                    </CardContent>
                    <CardFooter className="p-7 pt-0 mt-auto">
                        <div className="w-full flex items-center justify-between py-5 border-t border-white/10">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5 text-muted-foreground group/stat">
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center transition-colors group-hover/stat:bg-amber-500/10 group-hover/stat:text-amber-500">
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M11 20.3546L5.70711 15.0617C5.31658 14.6712 5.31658 14.038 5.70711 13.6475L12.5519 6.80277C12.893 6.46162 12.893 5.9085 12.5519 5.56735C12.2107 5.22621 11.6576 5.22621 11.3164 5.56735L6.64645 10.2374M13.5 17.8546L18.7929 12.5617C19.1834 12.1712 19.1834 11.538 18.7929 11.1475L11.9481 4.30277C11.6069 3.96162 11.6069 3.4085 11.9481 3.06735C12.2893 2.72621 12.8424 2.72621 13.1835 3.06735L17.8536 7.7374" />
                                        </svg>
                                    </div>
                                    <span className="text-xs font-black tabular-nums tracking-widest">{article.clapsCount || 0}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-muted-foreground group/stat">
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center transition-colors group-hover/stat:bg-red-500/10 group-hover/stat:text-red-500">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </div>
                                    <span className="text-xs font-black tabular-nums tracking-widest">{(article as any)._count?.likes || 0}</span>
                                </div>
                                <div className="flex items-center gap-3 ml-2 border-l border-white/10 pl-5">
                                    <div className="flex items-center gap-1.5 text-muted-foreground/50">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        <span className="text-[10px] font-black tracking-widest">{article.viewCount || 0}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground transition-all duration-300 transform group-hover:rotate-[-45deg] group-hover:scale-110 shadow-lg shadow-primary/20">
                                <ArrowRight className="w-4.5 h-4.5" />
                            </div>
                        </div>
                    </CardFooter>
                </div>
            </Card>
        </Link>
    );
}
