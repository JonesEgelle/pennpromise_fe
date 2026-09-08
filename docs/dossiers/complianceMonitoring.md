# Module dossier — Compliance Monitoring

Figma: `580:5464` (light) / `619:2302` (dark). Route `/compliance-monitoring`.

```
Feature:
  A Sharia-compliance dashboard: an ethical-integrity score, four monitored
  compliance areas with status, an ethical-alert feed, a governance-document
  panel with a "Generate Fatwa Certificate" action, an append-only ethical
  activity log, an alerts-by-type chart, and an audit-readiness callout.

Business Goal:
  One glance tells a compliance officer whether the platform is within AAOIFI /
  SEC Sharia alignment, what needs attention now, and whether it is audit-ready.

Actors:
  - Compliance Officer (primary) — reads everything; acts on alerts (deep-link),
    generates the Fatwa certificate, runs the integrity check, exports.
  - Sharia Board — reads governance docs; approves.
  - Support — read-only top score + alerts.

Entities & States:
  - integrityScore (0–100) + delta vs last quarter + a short bar history.
  - StatusCard: { id, title, description, status ∈ {halal_verified,
    review_needed, optimal, attention} }. Tone: verified/optimal → success,
    review_needed → warning, attention → destructive.
  - EthicalAlert: { id, title, description, at, tags[], tone }. Append-only from
    the compliance engine.
  - GovernanceDoc: { id, title, subtitle } (Quarterly Sharia Audit Report,
    Zakat Assessment Summary).
  - EthicalLogEntry: { id, title, description, at, refId }. Append-only.
  - alertsByType: { label ∈ {RIBA, HALAL, ZAKAT}, count }.
  - auditReadiness: narrative + a readiness percentage.

Rules:
  - Everything on this screen is READ-ONLY except the two actions:
    "Generate Fatwa Certificate" and "Run Sharia Integrity Check" — both
    async jobs.
  - integrityScore < 90 → the number renders in the warning tone; ≥ 90 → info.
  - "View All" on the alert feed routes to a full alerts list (v1: same screen).
  - Governance docs open a viewer (v1: stub).

Side Effects:
  - Generate Fatwa Certificate / Run Sharia Integrity Check → mutations with
    pending/success/error; success + error toast. (v1: stub jobs.)
  - Export Sharia Audit Report → async job. (v1: stub.)
  - No other writes.

Edge Cases / Failure Modes:
  - Any panel query fails independently → inline error + retry; page still
    renders.
  - Empty alert feed → "No open ethical alerts."
  - alertsByType all zero → hide the chart body, show "No alerts this period."

Concurrency:
  - Read-only → no locking. Data refetches on interval.
  - The two job actions guard double-submit via `isPending`.

Observability:
  - Query keys: COMPLIANCE_QUERY_KEYS.all / .overview.
  - Job runs (fatwa cert, integrity check) write audit entries
    (`resourceType: "sharia_record"`).
```

## v1

Presentational; one `mockComplianceOverview` object; `useComplianceOverview`
query; the two actions are `TODO(api-contract)` stub mutations.
