import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Providers from './providers';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'Blog Platform',
    description: 'AI-powered blog platform for passive income',
};

import { ThemeProvider } from '@/components/theme-provider';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <Providers>
                        {children}
                        <Toaster position="bottom-right" />
                    </Providers>
                </ThemeProvider>
            </body>
        </html>
    );
}
