import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { prisma } from '@blog/db';
import { type Session } from 'next-auth';

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            role?: string;
        };
    }
}

export const createTRPCContext = async (opts?: {
    req?: any;
    session?: Session | null;
}) => {
    return {
        prisma,
        req: opts?.req,
        session: opts?.session,
    };
};

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
    transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

const isAuthed = t.middleware(({ next, ctx }) => {
    if (!ctx.session?.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next({
        ctx: {
            session: { ...ctx.session, user: ctx.session.user },
        },
    });
});

const isAdmin = t.middleware(({ next, ctx }) => {
    if (!ctx.session?.user || (ctx.session.user as any).role !== 'ADMIN') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin role required' });
    }
    return next({
        ctx: {
            session: { ...ctx.session, user: ctx.session.user },
        },
    });
});

export const protectedProcedure = t.procedure.use(isAuthed);
export const adminProcedure = t.procedure.use(isAdmin);
