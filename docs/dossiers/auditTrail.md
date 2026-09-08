# Module dossier — Audit Trail & Logging (Ethical Audit Explorer)

Figma: `595:8078` (light) / `619:3363` (dark) — labelled "System Health" in the
file but the content is the audit explorer. Route `/audit-trail`.

```
Feature:
  A read-only, immutable log of every administrative action, filterable by
  operator, action type, Sharia module, and date range. Each row shows the
  before/after system change. Plus two roll-up stats and two viz panels
  (Sharia audit coverage, weekly monitoring load).

Business Goal:
  A defensible "who did what, when, and what changed" record for SEC / AAOIFI
  review, and a live monitor for unauthorised or risky admin activity.

Actors:
  - Compliance Officer / Auditor (primary) — filters and reads; exports.
  - Administrator — reads; investigates risk flags.
  - Nobody writes here from the UI — entries are append-only, produced by every
    other module's mutations.

Entities & States:
  - AuditEntry: id, at, admin { name, id }, action ∈ {update, security_login,
    delete, create}, module, target, change { field, old, new } | null,
    resourceType.
  - Filters (server-side): { admin, action, module, startDate, endDate }.
  - Stats: logsTracked (last 24h), nonComplianceAlerts.
  - Viz: shariaCoveragePct; monitoringLoad — 7-day × N-band density grid.

Rules:
  - Entries are IMMUTABLE. No edit / delete / create affordance anywhere.
  - Server-side filtering + paging from the first commit. "Apply Filter" commits
    the current filter draft (the selects/dates are a draft until applied).
  - Action badge tone: create → success, update → info, delete → destructive,
    security_login → warning.
  - `change` renders as an old-chip → new-chip diff; null → "—".
  - Pagination is Previous / Next + "Showing X of N events" (matches Figma — not
    the numbered pager).
  - `resourceType` is always specific (user | admin_user | role | kyc_case |
    transaction | sharia_record | system_config) — never generic (CLAUDE.md).

Side Effects:
  - "Export Log" / "Sharia Compliance Report" → async export jobs with the
    applied filters; pending/success/error toast. (v1: stub.)
  - No mutations otherwise.

Edge Cases / Failure Modes:
  - No results for a filter → table empty state, viz panels still render.
  - `change` with only an old or only a new value → show the one present.
  - Long target / module strings → truncate with a title tooltip.
  - Future / malformed dates in a row → "—".

Concurrency:
  - Read-only, append-only → no locking. New entries appear on refetch /
    interval ("Live Monitoring Active").

Observability:
  - Query keys: AUDIT_TRAIL_QUERY_KEYS.all / .list(params) / .stats.
  - This screen IS the observability surface for every other module.
```

## Implementation note (v1)

Presentational. `lib/mock-data.ts` seeds ~40 entries + stats + the load grid;
`controllers/auditTrailController.ts` wraps them in `useQuery`. Export jobs are
`TODO(api-contract)` stubs.
