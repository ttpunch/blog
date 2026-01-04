import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const content = `
# Typography & Syntax Highlighting Test

This is a paragraph to test typography. It should have nice spacing and font rendering thanks to **@tailwindcss/typography**.

## Code Example

Here is a TypeScript code block to test syntax highlighting:

\`\`\`typescript
interface User {
  id: number;
  name: string;
}

function greet(user: User): string {
  return \`Hello, \${user.name}!\`;
}

const user: User = { id: 1, name: "Alice" };
console.log(greet(user));
\`\`\`

## List Test

- Item 1
- Item 2
- Item 3
`;

    // Upsert 't' slug just in case it was deleted, but previous search found it.
    // Actually update is safer if I know it exists, but upsert is robust.
    // I need a valid authorId if I create.
    // I'll stick to update since I saw it exists.

    await prisma.article.update({
        where: { slug: 't' },
        data: {
            content: content,
            title: 'Typography & Syntax Highlight Test',
            excerpt: 'Testing rendering capabilities.'
        }
    });

    console.log('Article updated successfully.');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
