# CircleCast Architecture Overview

## Goals

1. Facilitate curated, low-latency audio conversations for niche communities.
2. Embed AI services for moderation, summarisation, and engagement loops.
3. Provide monetisation primitives (subscriptions, boosts, payouts) with minimal friction.
4. Maintain modularity so B2B white-label and enterprise features can be added without major rewrites.

## System Components

### Web Client (`apps/web`)

- Built with Next.js (App Router, React 18).
- Tailwind CSS for rapid UI development.
- State management through React Query + Zustand.
- Authentication via Auth.js (NextAuth) with OAuth/email magic links.
- Real-time audio powered by LiveKit Web SDK (pluggable).
- Integrates with AI services via tRPC procedures and WebSocket channels for companion updates.

### API Service (`apps/api`)

- Node.js with Fastify for HTTP + WebSocket APIs.
- tRPC router shared with web client for end-to-end types.
- Prisma ORM targeting PostgreSQL (initially Neon/Supabase, switchable) with seed scripts for sample data.
- Background workers (BullMQ + Redis) for AI pipelines: summarisation, clip generation, matchmaking.
- LiveKit Server (managed) or custom SFU integration for audio rooms (adapter pattern).
- Stripe Connect integration for creator payouts and subscription management.
  - Webhook handler (`/stripe/webhook`) verifies events for subscriptions and transfers.

### AI & Data Layer

- ASR: Whisper (OpenAI) or Deepgram managed API.
- Summaries/Highlights: GPT-4o/Anthropic Claude via queued jobs.
- Moderation: Safety classifiers + heuristics with escalation hooks.
- Vector store (Postgres pgvector or Pinecone) for interest embeddings and companion memory.

## Data Flow Snapshot

1. User describes interests → embeddings generated → matched to circle templates.
2. During live session, audio streams via LiveKit. Recordings stored in object storage (S3-compatible).
3. Post-session pipeline:
   - Transcribe audio.
   - Generate summary, action items, highlights.
   - Update circle companion knowledge base.
   - Produce promotional clip suggestions.
4. Monetisation events captured via Stripe webhooks → update entitlements.

## Security & Compliance

- All recordings gated by consent and retention policies.
- RBAC for hosts/moderators vs. members.
- PII encryption at rest; secrets managed through environment-specific vaults.
- Audit trails for moderation interventions.

## Deployment Targets

- Web: Vercel or containerised deployment.
- API: Fly.io/Render/Kubernetes cluster.
- Workers: Separate autoscaled queue consumers.
- Data: Managed Postgres + Redis + Object Storage (R2/S3).

## Next Steps

1. Scaffold monorepo tooling (pnpm, Turborepo-style workspaces).
2. Implement shared domain models and tRPC layer.
3. Stand up LiveKit dev environment and stub AI pipelines.
4. Deliver vertical slice: interest onboarding → circle lobby → companion summary.
