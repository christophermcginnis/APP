# CircleCast

AI-powered micro-community voice network platform.

## Vision

CircleCast blends the intimacy of small-group audio with AI automation so creators and specialists can spin up premium “audio circles” in seconds. The platform focuses on matchmaking, continuous engagement, and monetization tooling.

## Product Pillars

- **Curated Voice Circles** – Users describe interests and receive AI-matched live audio rooms with 5–20 members.
- **AI Companions** – Each circle has an AI assistant that summarises, keeps conversation alive, and prompts re-engagement.
- **Instant Monetisation** – Hosts can charge subscriptions, launch premium sessions, and generate clips for promotion.
- **Voice + Visual Hybrid** – Optional collaborative canvas for slides, whiteboards, and media sharing.

## Repository Layout (draft)

```
apps/
  web/            # Next.js web client
  api/            # TypeScript service (tRPC/Express) for core APIs and websockets
packages/
  core/           # Shared domain models, type definitions
  config/         # Reusable tooling configs
docs/
  architecture.md # System architecture & technical decisions
```

## High-Level Roadmap

1. MVP foundations (voice matching, AI summaries, Stripe tiers).
2. Engagement tooling (clip studio, visual mode, CircleBoosts).
3. Enterprise & pro features (white-label, analytics, AR experiments).

## Getting Started

Full setup instructions will be added as services are scaffolded. Initial tasks:

1. Install dependencies with `pnpm install` (recommended).
2. Configure environment variables using provided `.env.example` files.
   - `apps/api/.env` → Fastify service (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `DATABASE_URL`, etc.).
   - `apps/web/.env` → Next.js client (`NEXTAUTH_SECRET`, `STRIPE_PUBLISHABLE_KEY`, etc.).
3. Provision a Postgres database and update `DATABASE_URL` to point at it.
   - Local option: `docker compose up -d db` (uses the bundled `docker-compose.yml`, see `docs/local-db.md`).
   - Hosted option: Neon, Supabase, Render, etc.
4. Generate the Prisma client and run an initial migration:
   ```bash
   pnpm --filter @circlecast/api prisma:generate
   pnpm --filter @circlecast/api prisma:migrate --name init
   pnpm --filter @circlecast/api prisma:seed # optional seed data
   ```
5. Run development services via `pnpm dev`.

## Contributing

- Use conventional commits.
- Run format and lint scripts before pushing.
- Each feature should include unit/integration coverage where feasible.
