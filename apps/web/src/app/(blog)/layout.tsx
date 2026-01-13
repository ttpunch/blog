import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
    title: {
        default: 'AI Blog Platform',
        template: '%s | AI Blog Platform',
    },
    description: 'Insights on AI, Tech, and Passive Income.',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://example.com',
        siteName: 'AI Blog Platform',
    },
    twitter: {
        card: 'summary_large_image',
    },
};

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 relative">
                {children}
            </main>
            <Footer />
        </div>
    );
}
