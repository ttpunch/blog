const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkError() {
    const article = await prisma.article.findUnique({
        where: { id: 'cmjxupqja0000110uumls2wk1' }
    });

    if (!article) {
        console.log('Article not found');
        return;
    }

    console.log('=== Article Details ===');
    console.log('Title:', article.title);
    console.log('Status:', article.status);
    console.log('\n=== Pipeline State ===');

    if (article.pipelineState) {
        const state = JSON.parse(article.pipelineState);
        console.log(JSON.stringify(state, null, 2));
    } else {
        console.log('No pipeline state saved');
    }

    console.log('\n=== Outline ===');
    if (article.outline) {
        console.log(JSON.stringify(article.outline, null, 2));
    }

    await prisma.$disconnect();
}

checkError().catch(console.error);
