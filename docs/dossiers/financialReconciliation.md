# Module dossier — Financial Reconciliation

Figma: `580:4425` (light) / `619:2033` (dark). Route `/financial-reconciliation`.

```
Feature:
  A reconciliation workspace. Roll-up stats for the current period; a left queue
  of automated mismatch FLAGS between the internal (Halal) ledger and the
  Islamic-banking settlement record; a right pane to compare the two ledgers
  line-by-line for the selected flag and Approve or Skip a match, tagging the
  resolution reason.

Business Goal:
  Clear Sharia-compliance settlement discrepancies before period close, with a
  reason code on every resolution for the audit report.

Actors:
  - Finance / Reconciliation Officer (primary) — works the flag queue, resolves.
  - Compliance Officer — reviews; exports the Sharia Audit Report.

Entities & States:
  - ReconStats: totalHalalMatchedNgn, matchedTxns, reviewPending (flags),
    purifiedDiscrepancies, plus a 0–100 progress value + delta per tile.
  - ReconFlag: id, kind ∈ {coupon_mismatch, missing_log, duplicate_entry},
    title, txnId, at, internalLabel, internalAmount, providerLabel,
    providerAmount, note?. status ∈ {open, resolved, skipped}. The queue shows
    `open` only (derived latest-of-list).
  - ReconLedgerEntry: { date, id, amount, mismatch }.
  - Resolution: { flagId, reason ∈ {profit_sharing_adjustment,
    rounding_adjustment, currency_conversion, manual_write_off}, status }.
  - "Auto-match similarity > 95%" — a workspace toggle (auto-approve rows above
    the threshold); local, non-critical.

Rules:
  - Resolving a flag requires a `reason`. "Skip" defers it (moves to the bottom
    of the queue) without a reason.
  - Amounts via `formatNairaAmount`. Mismatched provider amounts render in the
    destructive tone.
  - Stat tiles marked "Priority" get a priority badge; delta colour by sign.
  - After a resolution the flag leaves the queue; auto-select the next.

Side Effects:
  - Resolve / Skip → mutation; onSuccess invalidate the reconciliation query +
    success toast; onError → error toast (both always present).
  - "Export Sharia Audit Report" → async job for the period. (v1: stub.)
  - Toggling auto-match → local only in v1 (TODO: persist + auto-resolve pass).

Edge Cases / Failure Modes:
  - Empty flag queue → "All flags cleared for this period" + an idle right pane.
  - Selected flag resolved in another tab → refetch drops it; advance to next.
  - Internal or provider ledger empty → show the side that exists + a note.
  - Resolve with no reason chosen → button disabled.

Concurrency:
  - Flags are decided by more than one officer → first resolution wins; a stale
    resolve refetches and advances. (Full optimistic locking = TODO once the
    resolution endpoint is specced.)
  - Double-submit guarded by mutation `isPending`.

Observability:
  - Query keys: FIN_RECON_QUERY_KEYS.all / .overview / .ledger(flagId).
  - Every resolution writes an audit entry (`resourceType: "reconciliation"`)
    with the reason code + before/after amounts.
```

## v1

Presentational; `lib/mock-data.ts` in-memory flags + ledger + stats,
`mockResolveFlag` drops the flag. Export + auto-match pass are `TODO(api-contract)`.
