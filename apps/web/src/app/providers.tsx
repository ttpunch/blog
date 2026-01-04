'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import React, { useState } from 'react';
import { trpc } from '@/lib/trpc';
import superjson from 'superjson';
import { SessionProvider } from 'next-auth/react';

export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());
    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({
                    url: process.env.NEXTAUTH_URL ? `${process.env.NEXTAUTH_URL}/api/trpc` : 'http://localhost:3000/api/trpc',
                }),
            ],
            transformer: superjson,
        })
    );

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                <SessionProvider>{children}</SessionProvider>
            </QueryClientProvider>
        </trpc.Provider>
    );
}
