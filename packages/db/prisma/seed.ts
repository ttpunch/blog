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
        },
        create: {
            email: adminEmail,
            name: 'Admin User',
            passwordHash: hashedPassword,
            bio: 'System Administrator',
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
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
