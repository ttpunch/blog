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

## Deployment

To deploy the application to production:

1.  **Secure Authentication**: Ensure you have generated a secure `NEXTAUTH_SECRET`.
2.  **Database Migration**: Run database migrations to set up the production schema.
    ```bash
    pnpm db:push
    ```
3.  **Seed Admin User**: Create the initial admin user with a hashed password.
    ```bash
    pnpm --filter @blog/db seed
    ```
4.  **Build**: Create an optimized production build.
    ```bash
    pnpm build
    ```
5.  **Start**: Run the production server.
    ```bash
    pnpm start
    ```

> [!IMPORTANT]
> Always use a secure password for the admin user. The project now uses `bcryptjs` for secure password storage.
