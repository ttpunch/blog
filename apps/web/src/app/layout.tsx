import type { Metadata } from 'next';
import { Syne, Outfit } from 'next/font/google';
import Providers from './providers';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';

const syne = Syne({
    subsets: ['latin'],
    variable: '--font-syne',
    display: 'swap',
    weight: ['400', '500', '600', '700', '800'],
});

const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-outfit',
    display: 'swap',
    weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
    title: {
        default: 'AXIOM — Intelligence Driven Insights',
        template: '%s | AXIOM',
    },
    description: 'Exploring the future through artificial intelligence. Emerging trends, deep dives, and radical ideas across AI and modern technology.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${syne.variable} ${outfit.variable} antialiased`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                >
                    <Providers>
                        {children}
                        <Toaster
                            position="bottom-right"
                            toastOptions={{
                                style: {
                                    background: 'hsl(240 9% 6%)',
                                    color: 'hsl(240 5% 95%)',
                                    border: '1px solid hsl(240 5% 11%)',
                                    fontFamily: 'var(--font-outfit), sans-serif',
                                    fontSize: '0.875rem',
                                },
                            }}
                        />
                    </Providers>
                </ThemeProvider>
            </body>
        </html>
    );
}
