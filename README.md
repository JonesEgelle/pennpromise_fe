# PennPromise Capital — Admin Dashboard

Internal operations console for PennPromise Capital, a Sharia-compliant fintech
platform. Built for compliance officers, support staff, and admins — this is
**not** the customer-facing app.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript (strict) ·
Tailwind v4 · Radix UI · TanStack Query · react-hook-form + Zod · axios.

Engineering conventions and the module workflow live in [`CLAUDE.md`](./CLAUDE.md).

## Getting started

```bash
cp .env.example .env.local   # then set NEXT_PUBLIC_API_BASE_URL
npm install
npm run dev
```

Open http://localhost:3000 — you'll be redirected to `/auth/signin`.

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Dev server (runs `sync:schema` first, non-fatal if offline) |
| `npm run build` | Production build (also typechecks) |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run sync:schema` | Pull the backend OpenAPI doc to `docs/api/` |

Run `lint`, `typecheck`, and `build` before every PR.

## Layout

```
src/app/            routing + data orchestration only (thin pages)
src/modules/{name}/ feature domains: components / controllers / types / lib / views
src/components/ui/  Radix/shadcn primitives
src/components/shared/  cross-module composites (DataTable, PageHeader, Sidebar, …)
src/services/       one thin apiClient wrapper per domain
src/lib/            api-client, auth-utils, api-error, utils
```

## Status

Scaffold + auth flow + dashboard shell are in place. Every module under
`src/modules/` is stubbed with a placeholder view. Before building a module's UI,
write its dossier (`docs/dossiers/{module}.md`) — see `CLAUDE.md` → "The habit".
