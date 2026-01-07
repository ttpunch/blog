import { prisma, ArticleStatus } from '@blog/db';

async function main() {
    console.log('Publishing latest article...');

    const article = await prisma.article.findFirst({
        orderBy: { createdAt: 'desc' },
    });

    if (!article) {
        console.log('No articles found to publish.');
        return;
    }

    const updated = await prisma.article.update({
        where: { id: article.id },
        data: {
            status: ArticleStatus.PUBLISHED,
            publishedAt: new Date(),
        },
    });

    console.log(`✅ Published article: "${updated.title}" (ID: ${updated.id})`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
