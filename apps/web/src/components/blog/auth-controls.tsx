'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
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
                                    <User className="mr-2 h-4 w-4" />
                                    Dashboard
                                </Link>
                            </DropdownMenuItem>
                        )}
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
