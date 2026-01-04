import { prisma } from './src';

async function main() {
    console.log('Syncing clapsCount for all articles...');

    const articles = await prisma.article.findMany({
        select: { id: true, title: true }
    });

    for (const article of articles) {
        const totalClaps = await prisma.clap.aggregate({
            where: { articleId: article.id },
            _sum: { score: true }
        });

        const sum = totalClaps._sum.score || 0;

        await prisma.article.update({
            where: { id: article.id },
            data: { clapsCount: sum }
        });

        console.log(`Synced: "${article.title}" - Total Claps: ${sum}`);
    }

    console.log('Sync complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
