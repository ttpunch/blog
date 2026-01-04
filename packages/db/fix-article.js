const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixArticle() {
    const fixed = await prisma.article.update({
        where: { id: 'cmjxupqja0000110uumls2wk1' },
        data: {
            status: 'AWAITING_APPROVAL'
        }
    });

    console.log('✅ Article fixed to AWAITING_APPROVAL');
    console.log('URL: /dashboard/articles/cmjxupqja0000110uumls2wk1/edit');

    await prisma.$disconnect();
}

fixArticle().catch(console.error);
