import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const articles = await prisma.article.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { title: true, slug: true, content: true }
    });

    console.log('Found articles:', articles.length);
    articles.forEach(a => {
        console.log(`- ${a.title} (slug: ${a.slug})`);
        console.log(`  Content snippet: ${a.content.substring(0, 50)}...`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
