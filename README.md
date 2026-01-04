# Blog Platform

AI-powered blog platform with custom CMS for passive income.

## Quick Start

```bash
# Install dependencies
pnpm install

# Setup database
pnpm db:generate
pnpm db:push

# Start development
pnpm dev
```

## Structure

```
apps/web       → Next.js frontend + dashboard
packages/db    → Prisma database layer
packages/api   → tRPC API routers
packages/ai    → LangGraph automation
```

## Environment Variables

Copy `.env.example` to `.env` and fill in:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Random secret for auth
- `CLOUDINARY_*` - Cloudinary credentials
- LLM API keys (OpenAI, OpenRouter, Ollama)
