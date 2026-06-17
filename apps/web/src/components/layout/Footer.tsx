import Link from 'next/link';
import { Zap, Twitter, Github, Rss } from 'lucide-react';

export function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-border/50 mt-auto">
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-14">

                    {/* Brand */}
                    <div className="md:col-span-5 space-y-5">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                                <Zap className="w-4 h-4 text-primary" />
                            </div>
                            <span
                                className="font-bold text-base tracking-tight"
                                style={{ fontFamily: 'var(--font-syne)' }}
                            >
                                AXIOM
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                            Exploring the future through the lens of artificial intelligence — emerging trends, radical ideas, and deep technical insights.
                        </p>
                        <div className="flex items-center gap-2.5 pt-1">
                            {[
                                { href: 'https://twitter.com', icon: Twitter, label: 'Twitter' },
                                { href: 'https://github.com', icon: Github, label: 'GitHub' },
                                { href: '/rss', icon: Rss, label: 'RSS' },
                            ].map(({ href, icon: Icon, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target={href.startsWith('http') ? '_blank' : undefined}
                                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                    aria-label={label}
                                    className="w-9 h-9 rounded-full border border-border/60 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Spacer */}
                    <div className="hidden md:block md:col-span-1" />

                    {/* Explore links */}
                    <div className="md:col-span-3 space-y-5">
                        <h4
                            className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60"
                            style={{ fontFamily: 'var(--font-syne)' }}
                        >
                            Explore
                        </h4>
                        <ul className="space-y-3">
                            {[
                                { href: '/', label: 'Home' },
                                { href: '/explore', label: 'All Articles' },
                                { href: '/about', label: 'About' },
                                { href: '/me/reading-list', label: 'Reading List' },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal links */}
                    <div className="md:col-span-3 space-y-5">
                        <h4
                            className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60"
                            style={{ fontFamily: 'var(--font-syne)' }}
                        >
                            Legal
                        </h4>
                        <ul className="space-y-3">
                            {[
                                { href: '/privacy', label: 'Privacy Policy' },
                                { href: '/terms', label: 'Terms of Service' },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-border/40 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-muted-foreground/50">
                        © {year} AXIOM. All rights reserved.
                    </p>
                    <p className="text-xs text-muted-foreground/30 tracking-wide">
                        Intelligence-driven editorial
                    </p>
                </div>
            </div>
        </footer>
    );
}
