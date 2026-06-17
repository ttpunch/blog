import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Always run fresh; never cache a keep-alive ping
export const dynamic = 'force-dynamic';

/**
 * Pings the database with a trivial query so Supabase's free tier does not
 * pause the project for inactivity. Triggered daily by a Vercel Cron.
 *
 * If CRON_SECRET is set, Vercel Cron sends it as a Bearer token and we reject
 * any request that doesn't match — so the endpoint can't be abused publicly.
 */
export async function GET(request: Request) {
    const secret = process.env.CRON_SECRET;
    if (secret) {
        const auth = request.headers.get('authorization');
        if (auth !== `Bearer ${secret}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    try {
        await prisma.$queryRaw`SELECT 1`;
        return NextResponse.json({ ok: true, pingedAt: new Date().toISOString() });
    } catch (error) {
        console.error('[keep-alive] DB ping failed:', error);
        return NextResponse.json(
            { ok: false, error: (error as Error).message },
            { status: 500 }
        );
    }
}
