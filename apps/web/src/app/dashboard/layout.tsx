'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
    LayoutDashboard,
    FileText,
    CheckSquare,
    Bot,
    ListTodo,
    Settings,
    LogOut,
    Menu,
    ChevronLeft,
    ChevronRight,
    User,
    Bell,
    MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Articles', href: '/dashboard/articles', icon: FileText },
    { name: 'Comments', href: '/dashboard/comments', icon: MessageSquare },
    { name: 'Review Queue', href: '/dashboard/review', icon: CheckSquare },
    { name: 'AI Writer', href: '/dashboard/ai-writer', icon: Bot },
    { name: 'Content Queue', href: '/dashboard/queue', icon: ListTodo },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated' && (session?.user as any)?.role !== 'ADMIN') {
            router.push('/');
        }
    }, [status, router, session]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-medium text-muted-foreground">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (!session) return null;

    const SidebarContent = ({ className }: { className?: string }) => (
        <div className={cn("flex flex-col h-full py-4", className)}>
            <div className="px-6 mb-8 flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl tracking-tight">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                        B
                    </div>
                    {isSidebarExpanded && <span>Platform</span>}
                </Link>
            </div>

            <ScrollArea className="flex-1 px-4">
                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-sm"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                    !isSidebarExpanded && "justify-center px-0"
                                )}
                                title={!isSidebarExpanded ? item.name : undefined}
                            >
                                <item.icon className={cn(
                                    "w-5 h-5",
                                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                                )} />
                                {isSidebarExpanded && <span>{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>
            </ScrollArea>

            <div className="px-4 mt-auto">
                <Separator className="mb-4" />
                <div className={cn(
                    "flex items-center gap-3 px-2 py-4",
                    !isSidebarExpanded && "flex-col"
                )}>
                    <Avatar className="h-9 w-9 border border-border">
                        <AvatarImage src={session.user?.image || ''} />
                        <AvatarFallback className="bg-primary/5 text-primary">
                            {session.user?.name?.charAt(0) || session.user?.email?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    {isSidebarExpanded && (
                        <div className="flex flex-col min-w-0">
                            <span className="text-sm font-semibold truncate">{session.user?.name || 'User'}</span>
                            <span className="text-xs text-muted-foreground truncate">{session.user?.email}</span>
                        </div>
                    )}
                </div>
                <Button
                    variant="ghost"
                    className={cn(
                        "w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 mt-1",
                        !isSidebarExpanded && "justify-center"
                    )}
                    onClick={() => signOut({ callbackUrl: '/' })}
                >
                    <LogOut className="w-5 h-5 mr-3" />
                    {isSidebarExpanded && <span>Sign Out</span>}
                </Button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row overflow-hidden">
            {/* Desktop Sidebar */}
            <aside className={cn(
                "hidden md:flex flex-col border-r h-screen sticky top-0 transition-all duration-300 bg-card/50 backdrop-blur-xl",
                isSidebarExpanded ? "w-64" : "w-20"
            )}>
                <SidebarContent />
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -right-3 top-12 h-6 w-6 rounded-full border bg-background shadow-xs transition-transform hover:scale-110"
                    onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                >
                    {isSidebarExpanded ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </Button>
            </aside>

            {/* Mobile Sidebar */}
            <div className="md:hidden flex items-center justify-between p-4 border-b bg-card/80 backdrop-blur-md sticky top-0 z-50">
                <Link href="/dashboard" className="font-bold text-lg tracking-tight">
                    Blog Platform
                </Link>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="w-6 h-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-72">
                        <SidebarContent />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-screen relative overflow-y-auto">
                <header className="hidden md:flex items-center justify-between h-16 px-8 border-b sticky top-0 bg-background/60 backdrop-blur-xl z-40">
                    <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                        <span className="capitalize">{pathname.split('/').pop() || 'Overview'}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="w-5 h-5 text-muted-foreground" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background" />
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="text-[10px]">JD</AvatarFallback>
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
                                <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })} className="text-destructive focus:text-destructive">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Sign Out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {children}
                </main>
            </div>
        </div>
    );
}
