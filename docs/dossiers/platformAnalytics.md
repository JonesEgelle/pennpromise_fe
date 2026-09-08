# Module dossier — Platform Analytics

Figma: `Platform Analytics` — light `590:6176` (1920×2137), dark `619:2559`
(1920×1208, **partial — see Edge Cases**). File `trKJGlm0ZiTGsGsFwrtwdJ`.

```
Feature:
  A read-only executive dashboard summarising Sharia-compliant platform growth,
  Halal asset positions (NGN), NG infrastructure health (Kano/Kaduna), an
  at-a-glance compliance-risk queue, a forward outlook, and an exportable
  compliance snapshot. Monitoring/reporting surface — not a system of record;
  every actionable item deep-links into its owning module.

Business Goal:
  One daily-scan surface answering: (a) are Halal growth and Sukuk/AUM trending
  as expected; (b) is any compliance alert due for triage now; (c) is the NG
  infrastructure healthy; (d) give compliance a one-click export for SEC / AAOIFI
  reporting.

Actors:
  - Compliance Officer (primary) — reads all panels; triages Compliance Alerts
    (opens the alert's source record); exports the Compliance Report.
  - Admin — reads all; uses Quick Admin Actions as shortcuts into
    Users / KYC / Transactions.
  - Support Staff — read-only; typically only top KPIs + System Health.
  - No customer / investor access (internal console).

Entities & States:
  - AnalyticsSummary: totalUsers, halalAumNgn, sukukVolumeNgn, avgSessionDuration.
    Each carries a period-over-period delta (%). Optional 0–100 `accent` value +
    colour drives the KPI mini-bar.
  - TrendSeries: time-bucketed points across the Islamic-calendar months shown
    (Ramadan…Muharram); two series — Halal Users (count) and AUM (₦). Bound to
    the selected range.
  - InvestmentMixSlice: label, percentage, colour; slices sum to ~100. Plus one
    editorial note string.
  - SystemHealthComponent: name, detail (latency / uptime / "Compliance
    Verified"), status ∈ {live, degraded, down}. Panel rollup ∈
    {operational, degraded, outage}.
  - ComplianceAlert: id, severity ∈ {high, medium, info}, source, issue,
    resourceType + resourceId (deep-link), createdAt. Append-only from the
    compliance engine; this screen never mutates them.
  - HalalSegment: name, tier ∈ {HNW, Retail, MSME}, two sub-stats.
  - OutlookProjection: projGrowthPct, estHalalRevNgn, shariaScorePct (0–100),
    narrative.
  - QuickAction: label, sublabel, target route, optional pending count.
  - NetworkPerformance: region label, uptimePct, named utilisation gauges (0–100).
  - Range: enum key ("last_30_days", …) — part of every summary/trend query key.

Rules:
  - All money is NGN; render via a shared `formatNaira()` with short-scale
    suffixes (T/B/M) — never recompute totals client-side.
  - Deltas render `+x.x%` / `−x.x%`; colour by SIGN (≥0 success, <0 destructive),
    never by which metric it is.
  - Investment-mix percentages shown as given; if they don't sum to 100 (±1)
    render raw values + a non-blocking dev warning — never silently normalise.
  - System Health rollup = operational iff every component is `live`; any
    `degraded` → degraded; any `down` → outage. Badge colour follows the rollup.
  - Compliance Alerts panel shows top 5 by severity then recency; "VIEW ALL" →
    /compliance-monitoring; row action opens the source record by `resourceType`.
  - Sharia Score 100% → success tone; <100 → warning tone. Colour only, no other
    client thresholding.
  - Quick Actions are pure navigation; pending counts are display-only.
  - Locale / currency config-driven (₦, WAT, en-NG) — no hard-coded "Naira" or
    timezone literals in components.

Side Effects:
  - "Export Compliance Report" → async job (POST). Explicit
    pending/success/error/timeout state from a TanStack mutation (never a local
    boolean); ref-based terminal latch to drop a late response after
    cancel/navigate; success toast carries the job id / download link; error
    toast on failure. No optimistic UI. Double-submit blocked while pending.
  - Range change ("Last 30 Days" …) → refetch AnalyticsSummary + TrendSeries with
    the new range in the query key.
  - "Sharia Audit" button → navigate to the audit trail pre-filtered to Sharia
    resource types (no mutation).
  - Alert rows / Quick Actions / VIEW ALL → client navigation only.
  - v1 has no websockets; "real-time" copy is aspirational — data is
    refetch-on-interval (staleTime ~60s). TODO(realtime): SSE.

Edge Cases / Failure Modes:
  - Each panel query fails independently → that card shows inline error + retry;
    the rest of the page still renders (no whole-page error boundary).
  - Empty trend series (new tenant) → chart empty state, not a flat zero line.
  - KPI value present, delta missing → show value, omit the badge (no
    "+undefined%").
  - Long alert issue text → truncate with a title tooltip; row never grows past
    two lines.
  - Investment mix with 0 slices → hide body, show "No allocation data".
  - Export job never returns → timeout state after N s, error toast, job id
    surfaced for manual follow-up.
  - `formatNaira()` must accept both a raw number and a pre-formatted string;
    NaN / null → "—".
  - Dark mode: chart series, KPI mini-bar accents, and promo-panel gradients are
    theme-aware (light: navy/blue lines; dark: coral/orange).
  - DESIGN GAP: the Figma dark artboard (`619:2559`) stops after Halal Segments /
    Sharia Q2 Outlook — System Health, Compliance Alerts, Quick Admin Actions,
    Ethical Intelligence and Network Performance have NO dark design. Default:
    render them with the shared panels' own (already token-themed) dark
    treatment. TODO(design): confirm dark styling for the lower half.

Concurrency:
  - Read-only data → no optimistic-locking concerns.
  - Export mutation: disable while pending; a second export while one runs is
    blocked with a toast.
  - Rapid range switches → TanStack dedupes; latest range's data wins via keys.
  - Panel queries must not share interceptor/retry state (per-request, not
    module-global — CLAUDE.md).

Observability:
  - Stable keys: analytics.summary(range), .trend(range), .mix, .health,
    .alerts, .segments, .outlook, .network.
  - Export job: log start (job id, actor, range), completion, failure; show the
    job id in the UI on both success and timeout.
  - Alert deep-links carry `resourceType` so downstream audit entries attribute
    correctly.
  - No PII in client logs — Halal Segment investor names are display-only.
```

## Implementation note (v1)

No backend / OpenAPI schema exists yet, so v1 ships the **presentational layer
only**: shared panels + the composed view fed by
`src/modules/platformAnalytics/lib/mock-data.ts` (typed to the entities above,
marked `TODO(api-contract)`). Controllers/services (the per-panel TanStack
queries + the export mutation) are the mechanical next step once the contract is
confirmed — run `npm run sync:schema` first.
