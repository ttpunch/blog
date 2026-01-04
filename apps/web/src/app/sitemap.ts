import { MetadataRoute } from 'next';
import { prisma, ArticleStatus } from '@blog/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXTAUTH_URL || 'https://example.com';

    const articles = await prisma.article.findMany({
        where: { status: ArticleStatus.PUBLISHED },
        select: { slug: true, updatedAt: true },
    });

    const articleUrls = articles.map((article) => ({
        url: `${baseUrl}/article/${article.slug}`,
        lastModified: article.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        ...articleUrls,
    ];
}
