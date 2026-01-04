const fs = require('fs');
const path = require('path');

console.log('=== ArticleStatus Enum Validation ===\n');

// 1. Read schema.prisma to get defined enums
const schemaPath = path.join(__dirname, 'prisma/schema.prisma');
const schemaContent = fs.readFileSync(schemaPath, 'utf8');

const enumMatch = schemaContent.match(/enum ArticleStatus \{([^}]+)\}/);
if (!enumMatch) {
    console.error('❌ Could not find ArticleStatus enum in schema.prisma');
    process.exit(1);
}

const definedStatuses = enumMatch[1]
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('//'));

console.log('1. Defined in schema.prisma:');
definedStatuses.forEach(status => console.log(`   ✓ ${status}`));

// 2. Check content-pipeline.ts for onStep calls
const pipelinePath = path.join(__dirname, '../ai/src/graphs/content-pipeline.ts');
const pipelineContent = fs.readFileSync(pipelinePath, 'utf8');

const onStepMatches = pipelineContent.match(/onStep\?\.\('([^']+)'\)/g) || [];
const usedInPipeline = [...new Set(onStepMatches.map(match => {
    const m = match.match(/onStep\?\.\('([^']+)'\)/);
    return m ? m[1] : null;
}).filter(Boolean))];

console.log('\n2. Used in content-pipeline.ts (onStep calls):');
usedInPipeline.forEach(status => {
    const exists = definedStatuses.includes(status);
    console.log(`   ${exists ? '✓' : '❌'} ${status} ${exists ? '' : '(MISSING IN ENUM!)'}`);
});

// 3. Check ai.ts router
const routerPath = path.join(__dirname, '../api/src/routers/ai.ts');
const routerContent = fs.readFileSync(routerPath, 'utf8');

const statusMatches = routerContent.match(/status:\s*['"]([A-Z_]+)['"]/g) || [];
const usedInRouter = [...new Set(statusMatches.map(match => {
    const m = match.match(/status:\s*['"]([A-Z_]+)['"]/);
    return m ? m[1] : null;
}).filter(Boolean))];

console.log('\n3. Used in ai.ts router:');
usedInRouter.forEach(status => {
    const exists = definedStatuses.includes(status);
    console.log(`   ${exists ? '✓' : '❌'} ${status} ${exists ? '' : '(MISSING IN ENUM!)'}`);
});

// 4. Check article.ts router for enum usage
const articleRouterPath = path.join(__dirname, '../api/src/routers/article.ts');
const articleRouterContent = fs.readFileSync(articleRouterPath, 'utf8');

const zodEnumMatches = articleRouterContent.match(/z\.enum\(\[([^\]]+)\]\)/g) || [];
console.log('\n4. Zod enum definitions in article.ts:');

let hasIssues = false;
zodEnumMatches.forEach((match, index) => {
    const enumValues = match
        .match(/z\.enum\(\[([^\]]+)\]\)/)[1]
        .split(',')
        .map(v => v.trim().replace(/['"]/g, ''));

    console.log(`\n   Enum definition ${index + 1}:`);
    enumValues.forEach(status => {
        const exists = definedStatuses.includes(status);
        if (!exists) hasIssues = true;
        console.log(`      ${exists ? '✓' : '❌'} ${status} ${exists ? '' : '(MISSING IN ENUM!)'}`);
    });
});

// Final summary
console.log('\n=== SUMMARY ===');
const allUsed = [...new Set([...usedInPipeline, ...usedInRouter])];
const missing = allUsed.filter(status => !definedStatuses.includes(status));
const unused = definedStatuses.filter(status => !allUsed.includes(status));

if (missing.length > 0) {
    console.log('\n❌ MISSING from enum (used in code but not defined):');
    missing.forEach(status => console.log(`   - ${status}`));
    hasIssues = true;
}

if (unused.length > 0) {
    console.log('\n⚠️  UNUSED (defined in enum but not used in pipeline/router):');
    unused.forEach(status => console.log(`   - ${status}`));
}

if (!hasIssues && missing.length === 0) {
    console.log('\n✅ ALL CHECKS PASSED - Enums are properly aligned!');
} else {
    console.log('\n❌ Issues found - please fix the mismatches above');
    process.exit(1);
}
