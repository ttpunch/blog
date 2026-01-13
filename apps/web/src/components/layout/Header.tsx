'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogOut, User, ListTodo, LayoutDashboard, Sparkles } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Header() {
    const { data: session } = useSession();
    const pathname = usePathname();

    const navLinks = [
        { href: '/', label: 'Explore' },
        { href: '/about', label: 'About' },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/50 backdrop-blur-xl supports-[backdrop-filter]:bg-background/20">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="p-1.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <span className="font-bold tracking-tight text-lg">AI Blog</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary",
                                pathname === link.href ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                    {session && (
                        <Link
                            href="/me/reading-list"
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary",
                                pathname === '/me/reading-list' ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            Reading List
                        </Link>
                    )}
                </nav>

                {/* Right Side: Auth & Theme */}
                <div className="flex items-center gap-2">
                    <ThemeToggle />

                    {session ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                                    <Avatar className="h-9 w-9 border border-white/10">
                                        <AvatarImage src={session.user?.image || ''} alt={session.user?.name || ''} />
                                        <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <div className="flex items-center justify-start gap-2 p-2">
                                    <div className="flex flex-col space-y-1 leading-none">
                                        {session.user?.name && (
                                            <p className="font-medium">{session.user.name}</p>
                                        )}
                                        {session.user?.email && (
                                            <p className="w-[200px] truncate text-sm text-muted-foreground">
                                                {session.user.email}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <DropdownMenuItem asChild>
                                    <Link href="/me/reading-list" className="cursor-pointer w-full">
                                        <ListTodo className="mr-2 h-4 w-4" />
                                        Reading List
                                    </Link>
                                </DropdownMenuItem>
                                {(session.user as any).role === 'ADMIN' && (
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard" className="cursor-pointer w-full">
                                            <LayoutDashboard className="mr-2 h-4 w-4" />
                                            Admin Dashboard
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/settings" className="cursor-pointer w-full">
                                        <User className="mr-2 h-4 w-4" />
                                        Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => signOut()}
                                    className="text-destructive focus:text-destructive cursor-pointer"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Sign Out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link href="/login">
                            <Button size="sm" className="rounded-full">
                                Sign In
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
