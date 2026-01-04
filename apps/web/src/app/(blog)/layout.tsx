import { Metadata } from 'next';

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

import { AuthControls } from '../../components/blog/auth-controls';

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <AuthControls />
            {children}
        </>
    );
}
