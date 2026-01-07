
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Articles ---');
    const articles = await prisma.article.findMany({
        take: 5,
        orderBy: { updatedAt: 'desc' },
        select: { id: true, title: true, coverImage: true, status: true, updatedAt: true }
    });
    articles.forEach(a => {
        console.log(`[${a.updatedAt.toISOString()}] ${a.title} (Status: ${a.status})`);
        console.log(`  Cover: ${a.coverImage || 'NULL'}`);
    });

    console.log('\n--- Media Table (Last 5) ---');
    const media = await prisma.media.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
    });
    media.forEach(m => {
        console.log(`[${m.createdAt.toISOString()}] ${m.filename} -> ${m.url}`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
