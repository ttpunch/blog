
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- All Articles ---');
    const articles = await prisma.article.findMany({
        orderBy: { updatedAt: 'desc' },
        select: { id: true, title: true, coverImage: true, status: true, updatedAt: true }
    });

    if (articles.length === 0) {
        console.log('No articles found.');
    } else {
        articles.forEach(a => {
            console.log(`[${a.updatedAt.toISOString()}] ${a.title} (Status: ${a.status})`);
            console.log(`  Cover: ${a.coverImage || 'NULL'}`);
        });
    }

    console.log('\n--- All Media Table Entries ---');
    const media = await prisma.media.findMany({
        orderBy: { createdAt: 'desc' },
    });

    if (media.length === 0) {
        console.log('No media entries found.');
    } else {
        media.forEach(m => {
            console.log(`[${m.createdAt.toISOString()}] ${m.filename} -> ${m.url}`);
        });
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
