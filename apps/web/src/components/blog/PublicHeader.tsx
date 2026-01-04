'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, LayoutDashboard, User, ListTodo } from 'lucide-react';

export function PublicHeader() {
    const { data: session } = useSession();

    return (
        <header className="fixed top-0 left-0 right-0 z-40 border-b border-white/5 bg-background/50 backdrop-blur-xl h-16 px-6 flex items-center justify-between">
            <Link href="/" className="font-bold text-lg tracking-tight flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                    B
                </div>
                <span>Platform</span>
            </Link>

            <div className="flex items-center gap-4">
                {session ? (
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" asChild className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                            <Link href="/me/reading-list">
                                <ListTodo className="w-4 h-4" />
                                <span className="text-xs font-semibold uppercase tracking-wider">Reading List</span>
                            </Link>
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={session.user?.image || ''} />
                                        <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">{session.user?.email}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {(session?.user as any)?.role === 'ADMIN' && (
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard" className="cursor-pointer">
                                            <LayoutDashboard className="mr-2 h-4 w-4" />
                                            <span>Admin Dashboard</span>
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem asChild>
                                    <Link href="/me/reading-list" className="cursor-pointer">
                                        <ListTodo className="mr-2 h-4 w-4" />
                                        <span>Reading List</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/settings" className="cursor-pointer">
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => signOut()} className="text-destructive focus:text-destructive cursor-pointer">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                ) : (
                    <Link href="/login">
                        <Button variant="default" size="sm" className="font-semibold rounded-full px-6">
                            Sign In
                        </Button>
                    </Link>
                )}
            </div>
        </header>
    );
}
