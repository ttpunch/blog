'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogOut, User, ListTodo, LayoutDashboard } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function AuthControls() {
    const { data: session } = useSession();

    return (
        <div className="fixed top-4 right-4 z-50 flex gap-2 items-center">
            <ThemeToggle />
            {session && (
                <Button variant="outline" size="sm" asChild className="hidden md:flex rounded-full h-10 border-white/20 bg-background/50 backdrop-blur-md px-4 text-muted-foreground hover:text-primary transition-colors">
                    <Link href="/me/reading-list" className="flex items-center gap-2">
                        <ListTodo className="w-4 h-4" />
                        <span className="text-xs font-semibold uppercase tracking-wider">Reading List</span>
                    </Link>
                </Button>
            )}
            {session ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="rounded-full pl-2 pr-4 h-10 border-white/20 bg-background/50 backdrop-blur-md">
                            <Avatar className="h-6 w-6 mr-2">
                                <AvatarImage src={session.user?.image || ''} />
                                <AvatarFallback className="text-xs">{session.user?.name?.[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{session.user?.name}</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {(session.user as any).role === 'ADMIN' && (
                            <DropdownMenuItem asChild>
                                <Link href="/dashboard" className="cursor-pointer">
                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                    Admin Dashboard
                                </Link>
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem asChild>
                            <Link href="/me/reading-list" className="cursor-pointer">
                                <ListTodo className="mr-2 h-4 w-4" />
                                Reading List
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard/settings" className="cursor-pointer">
                                <User className="mr-2 h-4 w-4" />
                                Profile
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => signOut()} className="text-destructive focus:text-destructive cursor-pointer">
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign Out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <Link href="/login">
                    <Button size="sm" className="rounded-full shadow-lg">
                        Sign In
                    </Button>
                </Link>
            )}
        </div>
    );
}
