import { trpc } from '@/lib/trpc';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react';
import type { Metadata } from 'next';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import type { AppRouter } from '@blog/api';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import 'highlight.js/styles/github-dark.css';
import { ReadingProgress } from '@/components/blog/ReadingProgress';
import { FuturisticBackground } from '@/components/ui/futuristic-background';

import { FormattedDate } from '@/components/blog/FormattedDate';
import * as motion from 'framer-motion/client';
import { LikeButton } from '@/components/blog/LikeButton';
import { ClapButton } from '@/components/blog/ClapButton';
import { BookmarkButton } from '@/components/blog/BookmarkButton';
import { CommentSection } from '@/components/blog/CommentSection';

// Create a server-side caller for metadata
const client = createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url: process.env.NEXTAUTH_URL ? `${process.env.NEXTAUTH_URL}/api/trpc` : 'http://localhost:3000/api/trpc',
        }),
    ],
    transformer: superjson,
});

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    // Fetch data
    try {
        const article = await client.article.bySlug.query({ slug: params.slug });

        if (!article) return {};

        return {
            title: article.title,
            description: article.excerpt || article.content.substring(0, 160),
            openGraph: {
                title: article.title,
                description: article.excerpt || article.content.substring(0, 160),
                images: article.coverImage ? [article.coverImage] : [],
                type: 'article',
                publishedTime: article.publishedAt?.toISOString(),
                authors: ['AI Author'],
            },
        };
    } catch (e) {
        return {
            title: 'Article Not Found',
        };
    }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
    let article;
    let clapData;

    try {
        article = await client.article.bySlug.query({ slug: params.slug });
    } catch (error) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-2xl font-bold mb-4">Article not found</h1>
                <Link href="/" className="text-primary hover:underline">
                    Return to Home
                </Link>
            </div>
        );
    }

    if (!article) {
        notFound();
    }

    try {
        clapData = await client.clap.byArticle.query({ articleId: article.id });
    } catch (e) {
        console.error("Failed to fetch claps", e);
        clapData = { totalClaps: 0, userClaps: 0 };
    }

    return (
        <main className="relative min-h-screen">
            <ReadingProgress />
            <FuturisticBackground />



            <article className="container mx-auto px-4 py-12 max-w-4xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-12 group transition-all">
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center mr-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </div>
                        Back to Blog
                    </Link>
                </motion.div>

                <header className="mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                            {article.category?.name || 'Knowledge Base'}
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground leading-[1.1] text-balance">
                            {article.title}
                        </h1>

                        <div className="flex items-center gap-6 text-sm text-muted-foreground border-y border-border/50 py-6 backdrop-blur-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-blue-600 flex items-center justify-center text-white font-bold shadow-lg">
                                    AI
                                </div>
                                <div>
                                    <p className="font-semibold text-foreground text-base">AI Author</p>
                                    <p className="text-xs">Generated Assistant</p>
                                </div>
                            </div>
                            <div className="h-8 w-px bg-border/50" />
                            <div className="space-y-1">
                                <p className="text-xs uppercase font-bold tracking-widest opacity-50">Published</p>
                                <p className="font-medium text-foreground">
                                    <FormattedDate date={new Date(article.publishedAt || article.createdAt)} />
                                </p>
                            </div>
                            <div className="h-8 w-px bg-border/50" />
                            <div className="space-y-1">
                                <p className="text-xs uppercase font-bold tracking-widest opacity-50">Read Time</p>
                                <p className="font-medium text-foreground">
                                    {article.readingTime || Math.ceil((article.content?.split(/\s+/).length || 0) / 200)} min read
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {article.coverImage && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative w-full aspect-[21/9] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] mt-12 group"
                        >
                            <img
                                src={article.coverImage}
                                alt={article.title}
                                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                        </motion.div>
                    )}
                </header>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mx-auto max-w-3xl text-left text-xl leading-relaxed text-foreground break-words"
                >
                    <ReactMarkdown
                        className="article-content"
                        rehypePlugins={[rehypeHighlight, rehypeRaw]}
                        remarkPlugins={[remarkGfm]}
                        components={{
                            h1: ({ node, ...props }) => <h1 {...props} className="text-4xl font-black mt-12 mb-6 tracking-tight" />,
                            h2: ({ node, ...props }) => <h2 {...props} className="text-3xl font-bold mt-12 mb-6 border-b-2 border-border pb-4 tracking-tight" />,
                            h3: ({ node, ...props }) => <h3 {...props} className="text-2xl font-semibold mt-10 mb-4 tracking-tight" />,
                            h4: ({ node, ...props }) => <h4 {...props} className="text-xl font-semibold mt-8 mb-3" />,
                            h5: ({ node, ...props }) => <h5 {...props} className="text-lg font-semibold mt-8 mb-3 uppercase tracking-wider opacity-90" />,
                            h6: ({ node, ...props }) => <h6 {...props} className="text-base font-semibold mt-8 mb-3 uppercase tracking-widest opacity-80" />,
                            p: ({ node, ...props }) => <p {...props} className="mb-6 text-xl leading-relaxed text-foreground" />,
                            ul: ({ node, ...props }) => {
                                const isTaskList = (node as any)?.children?.some((child: any) => child.tagName === 'li' && (child as any).children?.some((c: any) => c.tagName === 'input'));
                                return <ul {...props} className={cn("pl-6 mb-6 space-y-2 text-lg text-foreground", isTaskList ? "list-none pl-2" : "list-disc")} />;
                            },
                            ol: ({ node, ...props }) => <ol {...props} className="list-decimal pl-6 mb-6 space-y-2 text-lg text-foreground" />,
                            li: ({ node, ...props }) => {
                                const isTaskItem = (node as any)?.children?.some((child: any) => child.tagName === 'input');
                                return <li {...props} className={cn("leading-relaxed", isTaskItem ? "flex items-center gap-3" : "")} />;
                            },
                            input: ({ node, ...props }) => {
                                if (props.type === 'checkbox') {
                                    return <input {...props} className="w-4 h-4 rounded border-border bg-muted cursor-default pointer-events-none mt-1" readOnly />;
                                }
                                return <input {...props} />;
                            },
                            blockquote: ({ node, ...props }) => (
                                <blockquote {...props} className="border-l-4 border-primary pl-6 italic my-8 text-xl text-foreground font-medium bg-muted/30 py-4 pr-4 rounded-r-lg" />
                            ),
                            a: ({ node, ...props }) => (
                                <a {...props} className="text-primary underline decoration-primary/50 underline-offset-4 hover:decoration-primary transition-all font-medium" target="_blank" rel="noopener noreferrer" />
                            ),
                            code: ({ node, ...props }) => {
                                const isBlock = props.className?.includes('language-');
                                if (isBlock) return <code {...props} />;
                                return (
                                    <code {...props} className="bg-muted px-1.5 py-0.5 rounded font-mono text-sm font-semibold text-primary" />
                                );
                            },
                            pre: ({ node, ...props }) => (
                                <pre {...props} className="bg-[#0d1117] p-4 rounded-xl overflow-x-auto mb-8 border border-border/50 shadow-2xl" />
                            ),
                            img: ({ node, ...props }) => (
                                <motion.div
                                    whileHover={{ scale: 1.01 }}
                                    className="my-10 rounded-2xl overflow-hidden shadow-2xl border border-border/50"
                                >
                                    <img
                                        {...props}
                                        className="w-full h-auto m-0"
                                        loading="lazy"
                                    />
                                </motion.div>
                            ),
                            // Support for new elements
                            mark: ({ node, ...props }) => <mark {...props} className="bg-primary/20 text-primary px-1 rounded" />,
                            sub: ({ node, ...props }) => <sub {...props} className="text-xs" />,
                            sup: ({ node, ...props }) => <sup {...props} className="text-xs" />,
                        }}
                    >
                        {article.content}
                    </ReactMarkdown>
                </motion.div>

                <div className="mt-12 flex items-center justify-between border-y border-border/50 py-6 max-w-3xl mx-auto">
                    <div className="flex items-center gap-4">
                        <LikeButton articleId={article.id} />
                        <ClapButton
                            articleId={article.id}
                            initialTotalClaps={article.clapsCount}
                            initialUserClaps={clapData.userClaps}
                        />
                        <BookmarkButton articleId={article.id} />
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">
                        Share your thoughts below
                    </div>
                </div>

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="mt-20 pt-12 border-t border-border/50 max-w-3xl mx-auto"
                    >
                        <h3 className="text-xs uppercase font-bold tracking-[0.2em] text-muted-foreground mb-6">Exploration Tags</h3>
                        <div className="flex flex-wrap gap-3">
                            {article.tags.map((tag: any) => (
                                <Link
                                    href={`/tag/${tag.slug}`}
                                    key={tag.id}
                                    className="px-4 py-2 bg-secondary/50 hover:bg-primary hover:text-primary-foreground rounded-xl text-sm font-semibold transition-all backdrop-blur-sm border border-border/50"
                                >
                                    #{tag.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Futuristic CTA */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="mt-16 p-8 rounded-[1.5rem] bg-gradient-to-br from-primary via-blue-600 to-indigo-700 text-white relative overflow-hidden shadow-xl max-w-2xl mx-auto"
                >
                    <div className="relative z-10 max-w-lg mx-auto text-center">
                        <h2 className="text-2xl font-black mb-3">Enjoyed this deep dive?</h2>
                        <p className="text-blue-50/80 mb-6 text-sm">Subscribe to our newsletter to receive the latest AI-generated insights directly in your inbox.</p>
                        <div className="flex gap-2 max-w-md mx-auto">
                            <input type="email" placeholder="your@email.com" className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 flex-1 backdrop-blur-md placeholder:text-white/50 focus:outline-none focus:ring-2 ring-white/50 text-sm" />
                            <button className="bg-white text-primary font-bold px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors text-sm">Join Now</button>
                        </div>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-[100px]" />
                    <div className="absolute -left-10 -top-10 w-40 h-40 bg-blue-400/20 rounded-full blur-[60px]" />
                </motion.div>

                <CommentSection articleId={article.id} />
            </article>
        </main>
    );
}
