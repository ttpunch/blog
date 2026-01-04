import * as dotenv from 'dotenv';
import path from 'path';
import { PrismaClient } from '@prisma/client';

// Load .env from root
dotenv.config({ path: path.join(__dirname, '../../../../.env') });

const prisma = new PrismaClient();

async function verifyColumn() {
    console.log('--- Verifying Database Column: outline ---');
    try {
        const testTitle = `DB Verification Test ${Date.now()}`;
        console.log(`Creating article: ${testTitle}`);

        const article = await prisma.article.create({
            data: {
                title: testTitle,
                slug: `verify-db-${Date.now()}`,
                content: "Test content",
                status: 'DRAFT', // Use standard status first
                // Tests if the field exists at all
                outline: {
                    title: "Test Outline",
                    sections: [{ title: "Section 1" }]
                }
            }
        });

        console.log('✅ Article created successfully with outline field.');
        console.log('Article ID:', article.id);

        if ((article as any).outline) {
            console.log('✅ Outline data retrieved correctly:', JSON.stringify((article as any).outline));
        } else {
            console.error('❌ Outline field exists but returned null/undefined?');
        }

        // Clean up
        await prisma.article.delete({ where: { id: article.id } });
        console.log('Test article deleted.');

    } catch (error) {
        console.error('❌ Verification Failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

verifyColumn();
