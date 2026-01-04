'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="max-w-md w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-center">
                    <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                        <AlertCircle className="w-10 h-10" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight">Something went wrong</h1>
                    <p className="text-muted-foreground">
                        An unexpected error occurred. We've been notified and are working on it.
                    </p>
                    {error.digest && (
                        <p className="text-xs text-muted-foreground/50 font-mono">
                            Error ID: {error.digest}
                        </p>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        onClick={() => reset()}
                        className="gap-2"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        Try again
                    </Button>
                    <Button
                        variant="outline"
                        asChild
                        className="gap-2"
                    >
                        <Link href="/">
                            <Home className="w-4 h-4" />
                            Go home
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
