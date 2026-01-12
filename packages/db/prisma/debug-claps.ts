
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const slug = 'google-s-titans-ai-architecture-revolutionizing-ai-beyond-transformers-1767544342839';

    console.log(`Checking article with slug: ${slug}`);

    const article = await prisma.article.findUnique({
        where: { slug },
        select: {
            id: true,
            title: true,
            clapsCount: true,
            _count: {
                select: {
                    claps: true
                }
            }
        }
    });

    if (!article) {
        console.log('Article not found');
        return;
    }

    console.log('Article found:');
    console.log(`ID: ${article.id}`);
    console.log(`Title: ${article.title}`);
    console.log(`clapsCount (Field): ${article.clapsCount}`);
    console.log(`claps (Relation Count): ${article._count.claps}`);

    // Check claps table entries
    const claps = await prisma.clap.findMany({
        where: { articleId: article.id }
    });

    console.log(`Total Clap Entries: ${claps.length}`);
    const sumScore = claps.reduce((sum, c) => sum + c.score, 0);
    console.log(`Sum of Clap Scores: ${sumScore}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
