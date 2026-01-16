import Link from 'next/link';

export function Footer() {
    return (
        <footer className="border-t border-white/10 bg-black/20 backdrop-blur-md mt-auto">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} AI Blog Platform. All rights reserved.
                    </div>
                    <div className="flex items-center gap-6">
                        <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            Terms of Service
                        </Link>
                        <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            Twitter
                        </a>
                        <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            GitHub
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
