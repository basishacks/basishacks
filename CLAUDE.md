# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**basishacks_2026** is the official website for the BIBS-C Network Hackathon — a full-stack hackathon management platform. Participants register, form teams, submit projects, vote on peers' work, and view final rankings.

## Commands

```bash
# Install dependencies (Bun preferred)
bun i

# Initialize database
bunx wrangler d1 execute DB --file sql/init.sql
bunx wrangler d1 execute DB --command 'INSERT INTO hackathon VALUES(1, "not_started", 0, 0, 0, 0, 0, NULL, NULL) ON CONFLICT DO NOTHING'

# Start dev server (HTTPS required)
bun dev --https

# Build for production
bun run build

# Lint
bunx eslint .
```

## Architecture

**Stack**: Nuxt 4 + Vue 3 (frontend), Nitro/Cloudflare Workers (backend), Cloudflare D1 SQLite (database), deployed to Cloudflare Pages.

**Directory layout**:
- `app/` — Nuxt frontend (pages, components, middleware, utils)
- `server/` — Nitro API handlers (`server/api/`) and server-side utilities (`server/utils/`)
- `shared/` — Code used by both client and server: Zod schemas (`schemas.ts`), DB types (`database.d.ts`), API response types (`responses.d.ts`), scoring rubrics (`rubric.ts`)
- `sql/` — `init.sql` (up-to-date, complete schema) + numbered migration files

### Authentication

Email-only login flow: user enters `@basischina.com` email → `/api/auth/code` sends a time-limited code via an external service (`NUXT_SEND_CODE_URL`) → `/api/auth/login` validates code and creates a session via `nuxt-auth-utils`. The `auth` middleware on protected pages calls `requireUserSession()`.

Server-side auth guards are in `server/utils/auth.ts`: `requireUser()`, `requireJudge()`, `requireAdmin()`.

### Event State Machine

The `hackathon` table has a single row controlling global state:

| Status | What's allowed |
|--------|---------------|
| `not_started` | Registration, team creation/editing |
| `in_progress` | Projects can be submitted; teams locked |
| `voting` | Judges score + peers vote |
| `finished` | Results visible |
| `paused` | Maintenance |

### Scoring System

Two-tier scoring, calculated by `GET /api/admin/scores?update=true` (admin only):

- **Judges (75%)**: Score 0–5 per rubric category; weights differ by pathway
  - Junior: Innovation 30%, Presentation 25%, Technicality 20%, Theme 15%, Impact 10%
  - Senior: Impact 30%, Presentation 25%, Technicality 20%, Theme 15%, Innovation 10%
- **Peers (25%)**: 1–5 stars per project; votes must sum to exactly 12 per ballot
- **Final**: `(peer_avg × 0.25 + judge_weighted_avg × 0.75) × 10`

Rubric definitions live in `shared/rubric.ts`. Judge scores stored in `team_scores` (one row per judge per team). Peer votes stored in `ballots` + `ballot_scores`.

### Data Flow

- All request/response shapes are Zod-validated via schemas in `shared/schemas.ts` — add new fields there first.
- `server/utils/database/` contains one file per entity (users, teams, members, ballots, scores, hackathon) for D1 queries.
- `server/utils/convert.ts` maps raw DB rows to API response shapes.
- Frontend uses `useFetch()` with TypeScript generics against the response types in `shared/responses.d.ts`.

### Database Migrations

Schema changes go in `sql/migration-<N>.sql`. Run against D1 with:
```bash
bunx wrangler d1 execute DB --file sql/migration-<N>.sql
```

Whenever you add a migration file, update `init.sql` to keep it up-to-date with the latest schema. Note that this is different from most migration systems.
