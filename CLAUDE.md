@AGENTS.md

# PennPromise Capital — Admin Dashboard

Internal operations console for a Sharia-compliant fintech platform — for
compliance officers, support staff, and admins. **Not** the customer-facing app.

Domain vocabulary is first-class: BVN, NIN, NIMC, Sukuk, Mudaraba/Murabaha,
Zakat, Riba, Halal/Haram, PEP, Sharia Board/Fatwa, AAOIFI/SEC, WAT, ₦.

This file is the engineering contract for the repo. It ports the conventions
proven in the sibling project **dgtool_fe (StewardCore)** and layers PennPromise
deltas on top. Reproduce the *intent*, not just the letter.

---

## Core principles

1. **Reuse before building.** Check `src/components/ui` and
   `src/components/shared` before creating any component. Check `package.json`
   before adding a library.
2. **Match the existing structure** (below). A new feature slots into the same
   shape as every other feature.
3. **Add only what's asked.** No unrequested READMEs, docs, emoji, or decoration.
4. **Write the module dossier first.** See "The habit" — non-negotiable.

---

## Tech stack (carried from dgtool_fe unless noted)

| Layer | Choice |
|---|---|
| Framework | Next.js **16** App Router (Turbopack default), TypeScript `strict` |
| UI base | Radix UI primitives, shadcn "new-york" shape, committed to `src/components/ui` |
| Styling | Tailwind v4, CSS-first `@theme inline` in `src/app/globals.css` — no JS config file |
| Variants | `class-variance-authority` |
| Class merge | `cn()` (`clsx` + `tailwind-merge`) in `src/lib/utils.ts` |
| Icons | `lucide-react` only |
| Toasts | `sonner` only, driven by mutation `onSuccess` / `onError` |
| Server state | `@tanstack/react-query` — **all** server state, never `useState` |
| HTTP | `axios`, ONE instance: `src/lib/api-client.ts` |
| Forms | `react-hook-form` + `zod` + `zodResolver`, schema-first |
| Dates | `date-fns` + `formatDate()` in `src/lib/utils.ts` |

**Deltas from dgtool_fe (deliberate):**
- **Next 16, not 15** — scaffolded from `create-next-app@latest`. Async
  `params`/`searchParams` are mandatory; `middleware` is renamed `proxy`. Read
  `node_modules/next/dist/docs/` before using an unfamiliar Next API.
- **One API pattern only.** dgtool_fe had two (`apiClient`+services *and* a
  `useApiManager` hook + a second axios instance) plus a raw `fetch` outlier. We
  keep only `apiClient` + `services/{domain}.ts` + direct TanStack Query hooks.
- **Single token source of truth** — access token in `localStorage`
  (`src/lib/auth-utils.ts`). No NextAuth dual-storage. `next-auth` is
  intentionally NOT a dependency yet; revisit only if the confirmed backend
  session model needs it.
- **Centralised query keys from day one** — every module has
  `controllers/queryKeys.ts`. dgtool_fe adopted this late and inconsistently.
- **`no-console` lint rule** is on (`warn`, allows `warn`/`error`).

**Not present (decide explicitly, don't inherit the absence):** no test
framework, no CI yet. At minimum run `npm run lint` + `npm run typecheck` +
`npm run build` before every PR — wire these into CI early.

---

## Project structure

```
src/
├── app/
│   ├── auth/{signin,forgot-password,verify-otp,reset-password}/page.tsx
│   │   └── layout.tsx                     # AuthLayout (branded split screen)
│   ├── (accounts)/                        # authenticated group
│   │   ├── layout.tsx                     # AuthGuard + SessionMonitor + DashboardShell
│   │   └── {overview,users,kyc,transactions,financial-reconciliation,
│   │        compliance-monitoring,platform-analytics,system-health,settings}/page.tsx
│   ├── layout.tsx                         # root: Inter font + Providers
│   └── page.tsx                           # redirect → /overview
├── components/
│   ├── ui/                                # Radix/shadcn primitives, no domain knowledge
│   ├── shared/                            # cross-module composites (DataTable, PageHeader,
│   │                                         Sidebar, DashboardShell, FormInput, Modal, …)
│   ├── auth/                              # AuthGuard, SessionMonitor
│   └── providers/                         # QueryClientProvider, Providers, Toaster
├── constants/                             # routes.ts, navigation.ts, *-api-routes.ts
├── hooks/                                 # global hooks: useDebounce, useLogout
├── lib/                                   # api-client, api-error, auth-utils, utils
├── services/                              # {domain}.ts — thin apiClient wrappers
├── types/                                 # http.ts (IResponse, Paginator) + global types
└── modules/{module}/
    ├── components/                        # domain UI, composes shared/ + ui/
    ├── controllers/                       # queryKeys.ts + {feature}Controller.ts (TanStack Query)
    ├── types/                             # module types (form types via z.infer)
    ├── lib/                               # validators.ts (Zod) + module helpers
    └── views/                             # the page-level component the route renders
```

Modules: `overview`, `users`, `kyc`, `transactions`, `financialReconciliation`,
`complianceMonitoring`, `platformAnalytics`, `systemHealth`, `settings`, `auth`.
**Keep all five sub-folders in every module** even if one starts near-empty.

**Page files are thin** — a `page.tsx` imports and renders a `views/XView.tsx`
and nothing else. Real UI lives in `modules/*/views` and `modules/*/components`.

**Adding a feature, in order:**
1. Dossier (see "The habit").
2. Types → `src/modules/{module}/types/`.
3. Route constants → `src/constants/{feature}-api-routes.ts` (builder **functions**
   for path params, never a literal `{id}` placeholder string).
4. Service → `src/services/{feature}.ts` (thin wrapper over `apiClient`, returns
   the unwrapped `IResponse<T>`).
5. Query keys → `src/modules/{module}/controllers/queryKeys.ts`.
6. Controller hooks → `src/modules/{module}/controllers/{feature}Controller.ts`.
7. Validators → `src/modules/{module}/lib/validators.ts`.
8. Components → `src/modules/{module}/components/`.
9. View + page shell.

---

## API architecture

```
component → controller hook (useQuery/useMutation)
          → services/{domain}.ts → apiClient → IResponse<T>
```

- **`apiClient`** (`src/lib/api-client.ts`) — the only axios instance. Request
  interceptor attaches `Authorization: Bearer <token>` when the token isn't
  expired; response interceptor calls `handleSessionExpiry()` on 401. No second
  instance, no `useApiManager`, no raw `fetch`.
- **`IResponse<T>`** (`src/types/http.ts`) — `{ status, message, data }`.
  `Paginator` / `PaginatedData<T>` live here too. **One shared definition** —
  never redefine per module (dgtool_fe drifted this way).
- **Service files** — one object literal per domain, one method per operation,
  build filters with `URLSearchParams`, return `response.data`.
- **Controller hooks** — plain `useQuery` / `useMutation`. `select: (d) => d.data`
  to unwrap the envelope. Mutations: `onSuccess` → `invalidateQueries` (every
  affected key, think ripple effects) + `toast.success(res.message || fallback)`;
  `onError` → `toast.error(getApiErrorMessage(error, fallback))`.

Endpoint paths, envelope field names, and `Paginator` field names are currently
**inferred** — validate against the real backend before relying on them.

---

## Forms & validation

- Zod schema first; `type X = z.infer<typeof schema>`. **Never** hand-write a
  parallel interface — that drift class is structurally impossible to keep in
  sync (dgtool_fe hit it twice).
- `useForm({ resolver: zodResolver(schema), defaultValues })` →
  `form.handleSubmit(onSubmit)` → `onSubmit` calls the mutation.
- Use `FormInput` / `FormSelect` shared wrappers, not bare `ui/` inputs inside a
  `<Form>`.
- Numeric inputs stay **strings** in form state; parse to a number only at the
  API-call boundary.
- Submit/loading state comes from the mutation (`isPending`) into `Button`'s
  `isLoading` prop — not `formState.isSubmitting`.

---

## Tables & list pages

- `DataTable` (`src/components/shared/DataTable.tsx`) for table chrome:
  `columns` with `render()`, `rowActions` array (`{ label, onSelect, disabled? }`),
  its own loading/empty states. Memoised. Does **not** own pagination/search.
- `DataTableToolbar` for search + filters; `TablePagination` for paging.
- **Server-side pagination and filtering only**, from the first commit. Search is
  debounced via the shared `useDebounce`. Never fetch-all-and-filter client-side
  (dgtool_fe had to retrofit this across every screen).
- Any row action that can target "yourself" gets a **double guard**: disable the
  affordance (`disabled` callback) *and* re-check inside the handler.

---

## Auth

- Login: conventional email + password → token to `localStorage` → client
  `AuthGuard` on `(accounts)`. OTP is for **password reset only**, not login.
- `AuthGuard` is client-side and complements — does not replace — the backend
  rejecting unauthorized calls. Server-side (`proxy`) protection is a likely
  follow-up for a regulated fintech; it's a gap, not a "no".
- `SessionMonitor` proactively tears down an expired session on an interval and
  on tab focus.
- `isSessionExpired()` decodes the JWT `exp` client-side (5s skew); opaque tokens
  are left for the backend's 401.

---

## Styling & design tokens

Tailwind v4, CSS-first. All tokens live in `src/app/globals.css` under `:root` +
`@theme inline`. **Consume tokens through Tailwind classes** (`bg-primary`,
`text-muted-foreground`, `border-input`) — never inline a raw hex in a
`className`. The token set is the single source of truth.

Values (from Figma's rendered code):

| Token | Value |
|---|---|
| brand / primary | `#ff695b` |
| sidebar gradient | `#ff695b → #f6b331` (`.bg-sidebar-gradient`) |
| page background | `#f9faff` |
| surface / card | `#ffffff` |
| border subtle | `#e2e8f0`, `#f1f5f9` |
| input border | `#d7d7d7` |
| text primary / secondary / muted | `#101828` / `#475467` / `#64748b` |
| link / info | `#0047ab` |
| success | `#16a34a` on `#dcfce7` |
| danger | `#b91c1c` on `#fee2e2` |
| warning | `#b45309` on `#fef3c7` |
| radii | 8px small · 10–15px controls · 15–20px cards |
| font | **Inter** (Figma's Helvetica is an unlicensed-font fallback — confirm with design before production, don't block on it) |

---

## The habit — module dossiers (non-negotiable)

Before touching a component file in any module, write a dossier in this exact
shape. Match the depth of the two worked examples (KYC decisioning,
Users-vs-AdminUsers) from the kickoff companion doc — not just the headings.

```
Feature:
Business Goal:
Actors:
Entities & States:
Rules:
Side Effects:
Edge Cases / Failure Modes:
Concurrency:
Observability:
```

Do not start a module's UI until its dossier exists and every open question that
touches it (see "Guardrails") is answered or explicitly marked `TODO` with a
named safe default — never a silent assumption.

Keep dossiers in `docs/dossiers/{module}.md` (create as you go).

---

## Build order

1. ✅ Repo scaffold, CLAUDE.md, tokens, `apiClient`, `IResponse`.
2. ✅ Auth flow (signin, forgot-password, verify-otp, reset-password) + AuthLayout.
3. ✅ Dashboard shell: Sidebar, DashboardShell, PageHeader, empty route groups.
4. Missing Tier-1/2 primitives only (audit `src/components/ui` + `shared` first).
5. Overview (depends on nothing — smoke test for the shell).
6. Users + KYC (dossiers required first — the design source's two traps).
7. Transactions + Financial Reconciliation.
8. Compliance Monitoring + Platform Analytics.
9. Settings (all 5 tabs) + Audit Trail (reuse the audit-log shape — "who did
   what, when" is already a solved problem; don't re-solve it).

Run `/code-review` (or its equivalent) on **each module's PR**, not once at the
end on the whole dashboard.

---

## Guardrails (from dgtool_fe's own fix history)

- **CRUD completeness.** Every module ships create + read + update + delete +
  list *together*, or the missing action is visibly disabled with a reason —
  never a dead-end menu item.
- **Schema drift.** Backend schema is the source of truth. `npm run sync:schema`
  before writing a service file. Verify every form field is actually persisted by
  the real endpoint — "the form submits" is not proof. Never leave a
  `@ts-ignore` over a real type mismatch.
- **Immutable/append-only resources** (sessions, versions, audit entries): model
  "current state" as a derived *latest-of-list* query, not a single-record fetch.
- **Async / long-running ops** (uploads, AI verification, exports, reconciliation
  runs): explicit pending/success/error/timeout state from TanStack Query, never
  a local boolean. Use a **ref-based terminal latch** to reject stale updates
  arriving after completion; clear every timer on unmount *and* every
  terminal/cancel path. Never assume backend enum casing or field names.
- **List-page consistency.** Compose `DataTable` + `DataTableToolbar` +
  `TablePagination` — no hand-rolled table markup per module.
- **Silent mutation failures.** Every mutation has both a success *and* an error
  toast.
- **Sanitize rendered user-authored HTML** at the render sink, not by trusting
  the editor.
- **Shared interceptor state** (retry counters, etc.) must be per-request, never
  module-global.
- **Audit entries carry a `resourceType`** (`user` | `admin_user` | `role` | …).
  Never collapse resources into one generic category or free-text prose.
- **Self-action rule:** an `AdminUser` cannot remove/demote themselves; the last
  `Administrator` cannot be removed — block explicitly, don't fail silently.
- **Optimistic locking** for anything decided by more than one actor (KYC
  queue items, role edits): guard the write against the status the UI last
  fetched; on mismatch, refetch and block with a toast.
- **Config-driven locale/currency.** Everything is Nigeria-specific today
  (₦, NIN, BVN, WAT). If expansion is plausible, don't hard-code it.
- **Breadcrumbs** are an opt-in `PageHeader` slot, not baked-in chrome.
- **Modal / row-menu content** is undefined in the design source — the generic
  `Modal` and `DataTable` row menu exist; populate per feature once specced.

---

## Naming & imports

- PascalCase components; `use`-prefixed camelCase hooks; kebab-case service &
  constant files.
- Interfaces PascalCase (`Policy`, `AuthUser`); `I` prefix only for envelope /
  legacy shapes (`IResponse`). Form types are `z.infer` outputs.
- Import order: React/Next → third-party → `@/components/ui` →
  `@/components/shared` → hooks → services/lib/utils → types → constants.
