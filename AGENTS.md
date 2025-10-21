# CircleCast Agent Brief

## Vision Anchor
- CircleCast blends Discord-style intimacy, Clubhouse energy, and Patreon-grade monetisation into AI-guided "audio circles" for niche communities.
- Each circle is curated, summarised, and sustained by an AI companion that clips highlights, invites new members, and keeps discussions active between live sessions.
- The business flywheel mixes micro-subscriptions, creator promotion boosts, and a future white-label/B2B track.

## Current Stack & Tooling Snapshot (mid-2024)
### Workspace
- pnpm workspaces with TypeScript 5.4 across all packages and apps; linting/formatting handled through ESLint (TS/React presets) and Prettier. Root scripts proxy to app-level commands via `pnpm -r` for dev, build, lint, and typecheck flows. *(see `package.json`)*
- Shared config lives in `packages/config`; domain models and zod schemas are centralised in `packages/core` and re-used through `packages/api-types` for end-to-end typing.

### Web Client (`apps/web`)
- Next.js 14 App Router with React 18, Tailwind CSS 3.4, class-variance-authority, and Framer Motion powering the marketing hero and dashboard micro-interactions. *(see `apps/web/package.json`)*
- Data layer scaffolding uses tRPC React Query bindings plus `@tanstack/react-query` for client caching; auth planned through NextAuth 5 beta (Auth.js) but not yet wired end-to-end.
- Implemented pages:
  - A marketing landing page that pitches Companion, feature pillars, and community spotlights with CTA flows. *(see `apps/web/app/(marketing)/page.tsx`)*
  - Waitlist/signup form posting to the mock `profile.register` procedure, complete with optimistic UX and validation for onboarding data. *(see `apps/web/app/signup/page.tsx`)*
  - Dashboard shell with navigation for feed, circles, companion, monetisation, and profile destinations to anchor future in-app experiences. *(see `apps/web/app/(dashboard)/layout.tsx`)*

### API Service (`apps/api`)
- Fastify 4 with Zod-powered schemas, CORS control, raw-body Stripe support, and WebSocket streaming; logging via Pino/Pino Pretty for local dev. *(see `apps/api/src/app.ts`)*
- Prisma models for circles, sessions, companion tasks, and Auth.js accounts backed by PostgreSQL, with bcrypt-seeded fixtures that match the marketing narrative. *(see `apps/api/prisma/schema.prisma` & `apps/api/prisma/seed.ts`)*
- REST-ish routes alongside tRPC router share the same DTOs: `/circles`, `/sessions`, `/companion/tasks`, and `/companion/stream` provide CRUD + live updates; Stripe webhook endpoint is verified and stubbed for future handlers. *(see `apps/api/src/routes`)*

### Shared Types & Contracts
- `packages/core` exports zod schemas for circles, sessions, companion tasks, and creator profiles; `packages/api-types` composes those schemas into the tRPC `AppRouter`, keeping the web and API layers aligned while HTTP endpoints evolve. *(see `packages/core/src/domain/*.ts` & `packages/api-types/index.ts`)*

## Progress vs. Original Plan
| Pillar | Original ambition | Current state | Next focus |
| --- | --- | --- | --- |
| AI-curated voice circles | LiveKit-backed matchmaking with embeddings-driven routing. | Prisma data model + Fastify routes for circles/sessions; marketing and dashboard shell encourage sign-ups, but no audio infra yet. | Integrate LiveKit or equivalent SFU, build interest intake → matching service, connect to tRPC procedures, and add real-time presence. |
| AI companions | Always-on assistant summarising sessions, generating clips, nudging engagement. | Companion task model, seed data, REST/WebSocket feeds for queued tasks; no actual AI pipeline hooked up. | Implement job queue + AI providers (Whisper/Claude), persist outputs, surface insights in dashboard, and automate invites/highlights. |
| Monetisation | Tiered subscriptions, payouts via Stripe/crypto, CircleBoost promotions. | Stripe webhook verification + env scaffolding; monetisation UI nav slot ready but flows not implemented. | Model subscription plans & entitlements, integrate Stripe Checkout/Customer Portal, and design CircleBoost purchase UX. |
| Voice + visual hybrid | Visual Mode layering collaborative canvases during audio sessions. | Visual assets limited to marketing UI; no in-session visuals yet. | Evaluate whiteboard/canvas SDK (Liveblocks, Excalidraw) and attach to live session layout with recording-aware state. |
| AI-generated insights & companions | Polls, reminders, highlight reels from live talks. | Seeds demonstrate highlight + recap tasks and websocket stream, but automation is manual. | Add scheduled companion automations, integrate push/email (Resend/Nodemailer already installed) and wire to marketing drip. |

## Immediate Roadmap (Q3 launch target)
1. **Vertical slice:** Waitlist → circle creation → scheduled session with Companion task updates surfaced in dashboard.
2. **Authentication:** Finish Auth.js integration (email magic links + OAuth), secure Fastify routes, and share session context with tRPC.
3. **Audio foundation:** Stand up LiveKit dev environment, capture recordings, and enqueue transcription/summarisation tasks.
4. **Monetisation MVP:** Create subscription tiers, payment flows, and host dashboards with revenue snapshots.
5. **Companion automations:** Implement job queue (BullMQ/Redis) powering summaries, clips, and follow-up prompts delivered via email/push.

## Future Horizon (post-MVP → 2027+)
- Layer "CircleBoost" creator promotion budgets and analytics dashboards for conversion tracking.
- Package B2B/education white-label offering with compliance tooling, SSO, and advanced moderation.
- Explore AR “holographic study groups” once mobile/web audio foundation is production-ready.
- Launch "CircleCast Pro" marketplace for verified experts, integrating scheduling, invoicing, and premium companion templates.

## Collaboration Notes
- Prefer pnpm for dependency installs and `pnpm -r` scripts to keep workspaces in sync.
- Keep domain schemas in `packages/core`; extend both Prisma models and zod schemas together to prevent contract drift.
- When stubbing AI behaviour, add TODOs referencing the intended provider so follow-up tasks stay aligned with the AI automation thesis.
- Document new environment variables in `/docs` alongside sample `.env` updates to maintain deploy readiness.
