# Module dossier — System Health & Monitoring

Figma: `592:6914` (light) / `619:2896` (dark). Route `/system-health`.
(The sibling frame `595:8078` is the Audit Trail — see docs/dossiers/auditTrail.md.)

```
Feature:
  A live infrastructure + Sharia-compliance monitor for the Nigerian nodes
  (Kano, Lagos, Abuja, Port Harcourt): three node metrics with sparkline
  history, an ethical-product-hub status grid per node, an actionable alert
  feed, an ethical capital-distribution panel, and per-node ethical-health
  gauges.

Business Goal:
  Ops sees infra load and Sharia-compliance drift per region at a glance and
  can acknowledge / dismiss alerts without leaving the screen.

Actors:
  - Ops / SRE (primary) — reads metrics; acknowledges/dismisses alerts.
  - Compliance Officer — reads the hub compliance grid + ethical-health gauges.

Entities & States:
  - NodeMetric: { id, label, value, delta, bars[] }.
  - HubStatusRow: { product, statuses: Record<nodeKey, "ok"|"warn"|"error">,
    uptimePct }. Footer stats: advisoryRespMs (+delta), nonComplianceRiskPct
    (+delta).
  - HealthAlert: { id, severity ∈ {critical, warning, info}, title, description,
    at, actions ∈ subset of ["acknowledge","dismiss","audit_status"] }.
    Acknowledged / dismissed → leaves the feed.
  - distribution: { hotspot, volume }.
  - LocalHealthGauge: { label, percent, statusLabel, tone }.

Rules:
  - "Last Sync" timestamp + "Live Sync" indicator; data refetches on interval.
  - Node metric delta colour by sign.
  - Hub status icon: ok → success check, warn → warning triangle, error →
    destructive dot.
  - Alert severity tone: critical → destructive, warning → warning, info → info.
  - Acknowledge / Dismiss are the only writes; both need a confirm-free single
    click but are audited.

Side Effects:
  - Acknowledge / Dismiss / Clear All → mutations; onSuccess invalidate the
    system-health query + toast; onError toast.
  - No export on this screen.

Edge Cases / Failure Modes:
  - Empty alert feed → "All clear across regions."
  - A node metric with no history → flat baseline, not an error.
  - Distribution map asset unavailable → the panel still shows the hotspot +
    volume stats (v1 has no real map).

Concurrency:
  - Alerts acked by more than one operator → first ack wins; a stale ack
    refetches. Double-submit guarded by `isPending`.

Observability:
  - Query keys: SYSTEM_HEALTH_QUERY_KEYS.all / .overview.
  - Ack / dismiss write audit entries (`resourceType: "system_alert"`).
```

## v1

Presentational; one `mockSystemHealth` object; `useSystemHealth` query;
`useAckAlert` / `useDismissAlert` mock mutations that drop the alert.
