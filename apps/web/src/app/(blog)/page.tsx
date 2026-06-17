import { prisma, ArticleStatus } from '@/lib/db';
import { HomeContent } from './HomeContent';

// Re-render the cached homepage at most once a minute so new articles show up
// without paying the cross-region DB round-trip on every request.
export const revalidate = 60;

export default async function HomePage() {
    let items: any[] = [];
    try {
        items = await prisma.article.findMany({
            take: 10,
            where: { status: ArticleStatus.PUBLISHED },
            include: {
                category: true,
                tags: true,
                _count: { select: { likes: true, comments: true } },
            },
            orderBy: { publishedAt: 'desc' },
        });
    } catch (error) {
        // Never let a transient DB hiccup break the homepage render.
        console.error('[HomePage] Failed to load articles:', error);
    }

    return <HomeContent items={items} />;
}
