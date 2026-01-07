const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkRecentArticles() {
    console.log('=== Checking Recent Articles ===\n');

    try {
        const articles = await prisma.article.findMany({
            where: {
                OR: [
                    { status: 'REJECTED' },
                    { status: 'PLANNING' },
                    { status: 'AWAITING_APPROVAL' },
                    { status: 'WRITING' },
                ]
            },
            orderBy: { createdAt: 'desc' },
            take: 5,
        });

        if (articles.length === 0) {
            console.log('No recent articles with REJECTED/PLANNING/AWAITING_APPROVAL/WRITING status found.\n');
            return;
        }

        articles.forEach((article, index) => {
            console.log(`Article ${index + 1}:`);
            console.log(`  ID: ${article.id}`);
            console.log(`  Title: ${article.title}`);
            console.log(`  Status: ${article.status}`);
            console.log(`  Created: ${article.createdAt}`);
            console.log(`  AI Provider: ${article.aiProvider || 'N/A'}`);
            console.log(`  AI Model: ${article.aiModel || 'N/A'}`);

            if (article.pipelineState) {
                try {
                    const state = JSON.parse(article.pipelineState);
                    if (state.error) {
                        console.log(`  ❌ ERROR: ${state.error}`);
                    }
                    if (state.research) {
                        console.log(`  ✓ Research completed`);
                    }
                    if (state.seo) {
                        console.log(`  ✓ SEO completed`);
                    }
                } catch (e) {
                    console.log(`  Pipeline State: ${article.pipelineState.substring(0, 100)}...`);
                }
            }

            if (article.outline) {
                console.log(`  ✓ Has outline`);
            }

            console.log('');
        });

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

checkRecentArticles();
