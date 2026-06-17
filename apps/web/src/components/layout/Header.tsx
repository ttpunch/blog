'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogOut, User, ListTodo, LayoutDashboard, Zap, Menu, X } from 'lucide-react';
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
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetClose,
} from '@/components/ui/sheet';

export function Header() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    const navLinks = [
        { href: '/explore', label: 'Explore' },
        { href: '/about', label: 'About' },
        ...(session ? [{ href: '/me/reading-list', label: 'Reading List' }] : []),
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/70 backdrop-blur-2xl">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 group shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/40 transition-all duration-200">
                        <Zap className="w-4 h-4 text-primary" />
                    </div>
                    <span
                        className="font-bold text-[15px] tracking-tight"
                        style={{ fontFamily: 'var(--font-syne)' }}
                    >
                        AXIOM
                    </span>
                </Link>

                {/* Desktop Nav — centered */}
                <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                'px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
                                pathname === link.href
                                    ? 'text-primary bg-primary/10'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Right side */}
                <div className="flex items-center gap-2">
                    <ThemeToggle />

                    {session ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                                    <Avatar className="h-9 w-9 border border-primary/20">
                                        <AvatarImage src={session.user?.image || ''} alt={session.user?.name || ''} />
                                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                            {session.user?.name?.[0]?.toUpperCase() ?? 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <div className="flex items-center gap-3 p-2 border-b border-border mb-1">
                                    <Avatar className="h-8 w-8 border border-primary/20 shrink-0">
                                        <AvatarImage src={session.user?.image || ''} />
                                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                            {session.user?.name?.[0]?.toUpperCase() ?? 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col leading-none min-w-0">
                                        {session.user?.name && (
                                            <p className="text-sm font-semibold truncate">{session.user.name}</p>
                                        )}
                                        {session.user?.email && (
                                            <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                                        )}
                                    </div>
                                </div>
                                <DropdownMenuItem asChild>
                                    <Link href="/me/reading-list" className="cursor-pointer">
                                        <ListTodo className="mr-2 h-4 w-4" />
                                        Reading List
                                    </Link>
                                </DropdownMenuItem>
                                {(session.user as any).role === 'ADMIN' && (
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard" className="cursor-pointer">
                                            <LayoutDashboard className="mr-2 h-4 w-4" />
                                            Dashboard
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/settings" className="cursor-pointer">
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
                        <Link href="/login" className="hidden md:block">
                            <Button
                                size="sm"
                                className="rounded-full h-9 px-5 text-sm font-semibold"
                            >
                                Sign In
                            </Button>
                        </Link>
                    )}

                    {/* Mobile menu */}
                    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden h-9 w-9 rounded-full"
                            >
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="right"
                            className="w-72 p-0 bg-background/95 backdrop-blur-2xl border-border/50"
                        >
                            <div className="flex flex-col h-full">
                                {/* Mobile header */}
                                <div className="flex items-center justify-between px-6 h-16 border-b border-border/50">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                                            <Zap className="w-3.5 h-3.5 text-primary" />
                                        </div>
                                        <span
                                            className="font-bold text-sm tracking-tight"
                                            style={{ fontFamily: 'var(--font-syne)' }}
                                        >
                                            AXIOM
                                        </span>
                                    </div>
                                    <SheetClose asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </SheetClose>
                                </div>

                                {/* Mobile nav links */}
                                <nav className="flex flex-col gap-1 p-4 flex-1">
                                    {navLinks.map((link) => (
                                        <SheetClose asChild key={link.href}>
                                            <Link
                                                href={link.href}
                                                className={cn(
                                                    'px-4 py-3 rounded-xl text-sm font-medium transition-all',
                                                    pathname === link.href
                                                        ? 'text-primary bg-primary/10'
                                                        : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                                                )}
                                            >
                                                {link.label}
                                            </Link>
                                        </SheetClose>
                                    ))}
                                </nav>

                                {/* Mobile sign-in */}
                                {!session && (
                                    <div className="p-4 border-t border-border/50">
                                        <SheetClose asChild>
                                            <Link href="/login">
                                                <Button className="w-full rounded-xl font-semibold h-11">
                                                    Sign In
                                                </Button>
                                            </Link>
                                        </SheetClose>
                                    </div>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
