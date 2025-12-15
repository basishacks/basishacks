## Quick context for AI coding agents

This repository is a Nuxt (Nuxt 4) web app that runs on Cloudflare Workers/Nitro and uses D1 (SQLite-like) as the primary DB. Key directories:

- `app/` — Nuxt app (pages, components, layouts). Example: `app/pages/voting.vue` (composition API + `ref`/`reactive`).
- `server/` — server-side API routes used by the frontend. Routes follow the file-name → HTTP method convention: `index.get.ts`, `index.post.ts`, `index.patch.ts`, `index.delete.ts`.
- `server/utils/database/` — DB access helpers (e.g. `hackathon.ts`, `teams.ts`, `users.ts`).
- `types/` and `shared/` — global typings and Zod schemas (`shared/schemas.ts`) used for validation and DTOs.
- `sql/` — DB initialization SQL (`init.sql`) used with `wrangler d1 execute`.
- `wrangler.jsonc` and `worker-configuration.d.ts` — Cloudflare worker config and type hints.

Why this structure matters
- The app uses Nitro + the `nitro-cloudflare-dev` toolchain to target Cloudflare Workers. Server code must be compatible with Workers (no Node-only builtins).
- API filenames encode the HTTP method — editing/adding routes must follow that pattern so Nitro maps files correctly.

Developer workflows (commands)
- Preferred local dev (from `README.md`): using Bun
  - Install: `bun i`
  - Create/seed D1: `bunx wrangler d1 execute DB --file sql/init.sql`
  - Seed minimal row (example from README):
    `bunx wrangler d1 execute DB --command 'INSERT INTO hackathon VALUES(1, "not_started", 0, 0, 0, 0, 0, NULL, NULL) ON CONFLICT DO NOTHING'`
  - Run dev server (with HTTPS): `bun dev --https`
- npm alternative:
  - `npm i`
  - `npx wrangler d1 execute DB --file sql/init.sql`
  - `npm run dev -- --https`
- Useful npm scripts from `package.json`:
  - `dev` -> `nuxt dev`
  - `build` -> `nuxt build`
  - `preview` -> `nuxt preview`
  - `cf-types` -> `wrangler types` (generate Cloudflare types)

Platform & integration notes
- Cloudflare D1: DB migrations/seeding are done by running `wrangler d1 execute` against the `sql/init.sql` file.
- Wrangler & types: run `npm run cf-types` (or `bunx wrangler types`) to refresh platform types when the worker config changes.
- The project depends on `nitro-cloudflare-dev` — use the repo scripts and `wrangler`-based flows for local Cloudflare emulation.

Codebase conventions and examples
- HTTP route files: `server/api/teams/index.post.ts` creates teams, `server/api/teams/[id]/index.patch.ts` updates a team — always follow the `index.<method>.ts` pattern.
- Validation: Zod schemas live in `shared/schemas.ts` and are used across server and client where appropriate.
- Typing: global d.ts files live in `types/` and `shared/` (e.g. `types/worker-configuration.d.ts`) — prefer exported types from these locations.
- Frontend state: the app uses Vue 3 Composition API (`ref`, `reactive`, `computed`) inside `app/` components. Small client-only persistence sometimes uses a local in-memory Map (see `app/pages/voting.vue` — `memoryStore`) rather than localStorage.
- Auth: auth-related endpoints are under `server/api/auth/` (e.g. `code.post.ts`, `login.post.ts`) — inspect these for expected request/response shapes before changing client auth flows.

Safety and quick checks for edits
- When editing server code, ensure it doesn’t use Node-only APIs (fs, net, etc.). Target the Cloudflare worker runtime.
- If you change DB schema, update `sql/init.sql` and share the D1 seed/execute command in your PR description.

What to run locally when making changes
1. Install deps: `bun i` (preferred) or `npm i`.
2. Seed DB: `bunx wrangler d1 execute DB --file sql/init.sql`.
3. Start dev server: `bun dev --https` or `npm run dev -- --https`.
4. (Optional) Generate Cloudflare types: `npm run cf-types`.

Where to look first when investigating a bug
- Frontend behavior/UI: `app/pages/*` and `app/components/*`.
- API problems: `server/api/*` (follow the endpoint path to file). Look at `server/utils/database/*` for DB helpers.
- DB schema and seed problems: `sql/init.sql` and `wrangler d1` commands in README.

If unsure, ask the repo owner for the Cloudflare account and D1 access details before changing infra-related code.

Please review and tell me if you'd like this merged with additional examples (e.g., a concrete endpoint request/response pair or a reference to a common PR checklist used in this repo).
