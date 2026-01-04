import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="max-w-md w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-center">
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                        <FileQuestion className="w-10 h-10" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight">404 - Page Not Found</h1>
                    <p className="text-muted-foreground">
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
                    {/* Using a simple back button logic if possible or just standard links */}
                    <Link href="javascript:history.back()">
                        <Button variant="ghost" className="gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Go back
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
