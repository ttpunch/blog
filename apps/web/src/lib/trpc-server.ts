import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { AppRouter } from "@blog/api";
import superjson from "superjson";

export const client = createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url: process.env.NEXTAUTH_URL ? `${process.env.NEXTAUTH_URL}/api/trpc` : "http://localhost:3000/api/trpc",
        }),
    ],
    transformer: superjson,
});
