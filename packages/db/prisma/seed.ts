import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    const adminEmail = 'admin@example.com';
    const adminPassword = 'password';

    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const user = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {
            passwordHash: hashedPassword,
            role: 'ADMIN',
        },
        create: {
            email: adminEmail,
            name: 'Admin User',
            passwordHash: hashedPassword,
            bio: 'System Administrator',
            role: 'ADMIN',
        },
    });

    console.log(`✅ Admin user created/verified:`);
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);

    // Seed Categories
    console.log('   Seeding categories...');
    const categories = [
        { name: 'Technology', slug: 'technology', description: 'Tech news and reviews' },
        { name: 'Lifestyle', slug: 'lifestyle', description: 'Daily living tips' },
        { name: 'AI & Future', slug: 'ai-future', description: 'Artificial Intelligence trends' },
    ];

    for (const cat of categories) {
        await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {},
            create: cat,
        });
    }
    console.log(`✅ Default categories created.`);

    // Seed Articles
    console.log('   Seeding articles...');

    const adminUser = await prisma.user.findUnique({ where: { email: adminEmail } });
    const techCategory = await prisma.category.findUnique({ where: { slug: 'technology' } });
    const aiCategory = await prisma.category.findUnique({ where: { slug: 'ai-future' } });

    if (adminUser && techCategory && aiCategory) {
        const articles = [
            {
                title: 'The Future of AI in Web Development',
                slug: 'future-ai-web-development',
                excerpt: 'How Artificial Intelligence is reshaping the way we build the web.',
                content: 'Artificial Intelligence is revolutionizing web development...',
                status: 'PUBLISHED' as const,
                categoryId: techCategory.id,
                authorId: adminUser.id,
                viewCount: 150,
                readingTime: 5,
                publishedAt: new Date(),
            },
            {
                title: 'Understanding Neural Networks',
                slug: 'understanding-neural-networks',
                excerpt: 'A deep dive into the architecture of modern AI systems.',
                content: 'Neural networks are the backbone of deep learning...',
                status: 'PUBLISHED' as const,
                categoryId: aiCategory.id,
                authorId: adminUser.id,
                viewCount: 320,
                readingTime: 8,
                publishedAt: new Date(),
            }
        ];

        for (const article of articles) {
            const { categoryId, authorId, ...rest } = article;
            await prisma.article.upsert({
                where: { slug: article.slug },
                update: {},
                create: {
                    ...rest,
                    category: { connect: { id: categoryId } },
                },
            });
        }
        console.log(`✅ Sample articles created.`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
