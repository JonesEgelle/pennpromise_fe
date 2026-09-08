# Module dossier — Users

Figma: `Users` — light `567:3003` (1920×1208), dark `619:1561`. Detail overlay
`577:3756` ("Abubakar Bello"). File `trKJGlm0ZiTGsGsFwrtwdJ`.

```
Feature:
  Manage the platform's MEMBER records (Halal investors, and the internal
  "staff" the design lumps in the same list) — search, filter, view a full
  member profile with Halal-asset position + compliance history, create / edit /
  remove records, advance certification, restrict access, and export the
  filtered set to CSV.

Business Goal:
  Give compliance officers and admins one authoritative list of who is on the
  platform, what compliance/certification state each member is in, and a
  drill-down that carries everything needed to make a certification decision
  without leaving the screen.

Actors:
  - Compliance Officer (primary) — reads the list + detail; advances / renews
    certification; restricts access; exports.
  - Admin — full CRUD on member records; invites new members.
  - Support Staff — read-only list + detail; no mutations.

  NOT this module: the admin-console operators (people who log into THIS
  dashboard) — they live under Settings → User Management, which owns the
  self-action rules (an AdminUser cannot demote/remove themselves; the last
  Administrator cannot be removed). Those rules do NOT apply here — a member is
  never the acting user. (Users-vs-AdminUsers trap — CLAUDE.md.)

Entities & States:
  - Member: memberId (e.g. "NG-22041"), firstName, lastName, email, phone,
    location, dateOfBirth, gender, maritalStatus, profession, memberSince,
    lastLoginAt, certification, status.
  - certification ∈ {not_certified, review_pending, sharia_certified}.
    Lifecycle: not_certified → review_pending → sharia_certified (Fatwa/Sharia
    Board approval). Rendered in the column the design labels "Department"
    (design naming mismatch — TODO(design): confirm it is certification, not an
    org unit).
  - status ∈ {halal_active, dormant, suspended} (Figma shows only "Halal
    Active"; the rest are inferred — TODO(api-contract)). "Restrict Access" in
    the detail overlay moves a member to `suspended`.
  - MemberDetail (overlay only): halalAssets { totalUsd, benchmarkUsd,
    benchmarkDeltaPct, equityNgn, bondsNgn }, complianceHistory: entry { id,
    label, at, tone }[], complianceActions: { id, label, kind }[].
  - List query params: { page, pageSize, search, status?, certification? } —
    ALL server-side.

Rules:
  - Pagination, search, and status/certification filtering are server-driven
    from the first commit — never fetch-all-and-filter on the client
    (CLAUDE.md). Search is debounced via the shared `useDebounce`.
  - "Member Name" column = `firstName + " " + lastName`; blank parts tolerated.
  - "Last Login" via `formatDate(value, "datetime")`; null → "—".
  - Certification + status render through the shared `StatusBadge` (tone map
    extended with the member keys — one place).
  - Row actions: Edit (pencil) and Delete (trash) inline icons, matching Figma
    (not the ⋮ menu). Row click opens the detail overlay.
  - Two create entry points — "Invite Member" (PageHeader) and "Add New User"
    (list toolbar). Assumed: Invite = create + send onboarding email (no
    credential set here); Add = create the record directly. TODO(design):
    confirm. v1 opens the same MemberFormModal for both.
  - CRUD completeness: list + create + edit + delete + read(detail) all ship
    together (CLAUDE.md). No dead-end menu items.
  - Export CSV respects the currently applied search + filters.
  - Currency/locale config-driven (₦, en-NG). The overlay's Halal Assets panel
    shows a USD figure verbatim from the API — do not convert client-side.

Side Effects:
  - Create / Edit / Delete → TanStack mutations. onSuccess → invalidate
    USERS_QUERY_KEYS.list (and .detail on edit) + `toast.success(res.message ||
    fallback)`. onError → `toast.error(getApiErrorMessage(error, fallback))`.
    Every mutation has BOTH a success and an error toast.
  - "Update Certification" / "Renew certification" / "Restrict Access" / "Audit
    Portfolio" (overlay) → mutations against the member; same toast + invalidate
    contract. "Restrict Access" is destructive-styled and confirms first.
  - Export CSV → async job (POST with the active filters); pending/success/error
    state from the mutation, success toast carries the download.
  - Delete → confirm dialog first; on confirm, mutation, then the overlay/table
    row is gone.

Edge Cases / Failure Modes:
  - Empty list / no search matches → DataTable empty state ("No members
    found."), pagination hidden.
  - Search mid-request → debounced; TanStack `placeholderData: keepPreviousData`
    keeps the previous page visible while the next loads (no layout jump).
  - Page out of range after a delete on the last page → clamp to the new last
    page.
  - Overlay opened for a member deleted in another tab → detail query 404 →
    overlay shows an inline "This member no longer exists" and a close button.
  - Long email / name → truncate with a title tooltip.
  - Create/edit validation: email format, required first/last name; duplicate
    email is a server error surfaced via the error toast, not a client guess.

Concurrency:
  - Certification + status are decided by more than one actor (multiple
    compliance officers) → OPTIMISTIC LOCKING: every certification/status write
    carries the `certification`/`status`/`updatedAt` the UI last fetched. On a
    server version mismatch: refetch the detail, block the write, and
    `toast.error("This member was updated elsewhere — review and retry.")`
    (CLAUDE.md).
  - Double-submit guarded by the mutation's `isPending` → Button `isLoading`.
  - Delete + edit racing → invalidate both keys; a stale detail refetches.

Observability:
  - Query keys: USERS_QUERY_KEYS.all / .list(params) / .detail(id).
  - Every member mutation writes an audit entry with `resourceType: "member"`
    (never a generic category — CLAUDE.md); certification changes record the
    before/after state.
  - Export job logs actor + applied filters + row count.
  - No member PII (names, email, phone) in client-side logs.
```

## Implementation note (v1)

No backend yet. `lib/mock-data.ts` provides an in-memory store + async
`mockList/Get/Create/Update/Delete` fns; `controllers/usersController.ts` wraps
them in real `useQuery`/`useMutation` (keys, `keepPreviousData`, toasts,
invalidation) so the swap to a `services/users.ts` + `apiClient` call is
body-only. The list hook already takes server-style `{ page, pageSize, search,
status }` params — the component never sees the full list. Optimistic-locking
and the export job are stubbed with `TODO(api-contract)` markers per the rules
above.
