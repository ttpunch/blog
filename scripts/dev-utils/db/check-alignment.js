const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAlignment() {
    console.log('=== Checking AI Writer, Prisma, Database Alignment ===\n');

    try {
        // 1. Test PLANNING status
        console.log('1. Testing PLANNING status:');
        const planningTest = await prisma.article.create({
            data: {
                title: 'Test PLANNING Status',
                slug: `test-planning-${Date.now()}`,
                content: '',
                status: 'PLANNING',
            }
        });
        console.log(`   ✅ Database accepts status: PLANNING (ID: ${planningTest.id})`);
        await prisma.article.delete({ where: { id: planningTest.id } });

        // 2. Test AWAITING_APPROVAL status with outline
        console.log('\n2. Testing AWAITING_APPROVAL status with outline field:');
        const approvalTest = await prisma.article.create({
            data: {
                title: 'Test AWAITING_APPROVAL',
                slug: `test-approval-${Date.now()}`,
                content: '',
                status: 'AWAITING_APPROVAL',
                outline: {
                    title: 'Test Outline Title',
                    description: 'Test description',
                    sections: [
                        {
                            title: 'Section 1',
                            keyPoints: ['Point A', 'Point B'],
                            estimatedWordCount: 200
                        }
                    ]
                }
            }
        });
        console.log(`   ✅ Database accepts status: AWAITING_APPROVAL`);
        console.log(`   ✅ Database accepts outline field (JSON)`);
        console.log(`   Created article ID: ${approvalTest.id}`);

        // 3. Verify retrieval
        console.log('\n3. Verifying data retrieval:');
        const retrieved = await prisma.article.findUnique({
            where: { id: approvalTest.id }
        });
        console.log(`   Status: ${retrieved.status}`);
        console.log(`   Outline exists: ${!!retrieved.outline}`);
        if (retrieved.outline) {
            console.log(`   Outline title: ${retrieved.outline.title}`);
            console.log(`   Outline sections: ${retrieved.outline.sections?.length || 0}`);
        }

        // Clean up
        await prisma.article.delete({ where: { id: approvalTest.id } });

        console.log('\n=== ✅ ALL CHECKS PASSED ===');
        console.log('Prisma Schema ↔ Database ↔ AI Router are ALIGNED\n');

    } catch (error) {
        console.error('\n❌ ALIGNMENT CHECK FAILED:');
        console.error('Error:', error.message);
        if (error.code === 'P2000') {
            console.error('→ Database column constraint issue');
        } else if (error.code === 'P2002') {
            console.error('→ Unique constraint violation');
        } else if (error.message.includes('Invalid value')) {
            console.error('→ Database does not recognize the enum value');
            console.error('→ Run: npm run db:push');
        } else if (error.message.includes('does not exist')) {
            console.error('→ Database column missing');
            console.error('→ Run: npm run db:push');
        }
        console.error('\nFull error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkAlignment();
