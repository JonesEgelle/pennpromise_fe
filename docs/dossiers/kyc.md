# Module dossier — KYC & BVN (Compliance Queue)

Figma: `KYC` — light `567:3415` (1920×1208), dark `619:1689`. File
`trKJGlm0ZiTGsGsFwrtwdJ`. Nav label "KYC & BVN", route `/kyc`, page title
"Compliance Queue".

```
Feature:
  A decisioning workspace for KYC / Sharia onboarding cases. A prioritised queue
  of applicants on the left; on the right, the selected case's documents, the
  automated NIMC/BVN/SEC check result, a four-point Sharia compliance checklist
  the officer works through, a notes field, and Approve / Reject.

Business Goal:
  Let a compliance officer clear onboarding cases quickly and defensibly —
  every approval/rejection is backed by the checklist, the automated check, and
  a note, and is written to an immutable audit trail for SEC / AAOIFI review.

Actors:
  - Compliance Officer (primary) — selects a case, reviews docs + auto-check,
    ticks the checklist, writes a note, Approves or Rejects.
  - Senior Compliance / Sharia Board — opens "Sharia Profile" / "Audit Log";
    may override. (Override flow not in this design — TODO.)
  - Support Staff — read-only; no decision buttons.
  - The applicant is a Member (see the Users dossier) — never the acting user,
    so there is no self-review guard.

Entities & States:
  - KycCase (queue row): id, applicantName, applicantMemberId, tier
    (e.g. "Halal HNI", "Tier 1"), location, priority ∈ {high_priority,
    standard}, enqueuedAt (drives the "12m" / "1h 12m" timer), status.
  - status ∈ {reviewing, approved, rejected}. reviewing = in the active queue.
    approved / rejected are TERMINAL — the case leaves the active queue and its
    decision is append-only (never edited or deleted).
  - KycCaseDetail: + application (product, e.g. "Halal Equity Portfolio
    Application"), nin, bvn, documents[], autoCheck, checklist[], notes,
    decidedBy?, decidedAt?, version (for optimistic locking).
  - KycDocument: id, label ("NIN_Slip_Fatima.jpg"), kind ∈ {nin, poa, bank,
    other}, url. Rendered in a preview pane; officer-uploaded FILES (images /
    PDFs), never HTML — no sanitisation sink needed, but never inline as HTML.
  - AutoCheck: status ∈ {passed, flagged, failed}, confidencePct, summary
    (the "NIN validated. BVN match confirmed (98% confidence)…" text). Read-only
    machine output.
  - ChecklistItem: key ∈ {identity_ethics, bvn_haram_free, residency_zakat,
    pep_screening}, title, description, checked. Officer-toggled.
  - AuditEntry: id, at, actor, action, note?. Append-only; carries
    `resourceType: "kyc_case"`.
  - Queue params: { priority?: 'all'|'high_priority'|'standard', search? } —
    server-side; the queue is a DERIVED latest-of-list of `status = reviewing`
    cases, not a single-record fetch (CLAUDE.md immutable-resource rule).

Rules:
  - The queue shows only `status = reviewing`, ordered priority desc then
    enqueuedAt asc (oldest high-priority first).
  - Selecting a case loads its detail; the first case is auto-selected on load.
  - Approve is DISABLED until all four checklist items are checked. Tooltip /
    helper text says why.
  - Reject REQUIRES a note (min length); Approve note is optional.
  - The "Compliance Officer Notes" field placeholder in the design reads "Enter
    email address" — that is a design bug; use "Add a note for the record…".
  - The timer is `enqueuedAt → now`, formatted compact ("12m", "1h 12m"); it
    keeps counting while the case is open (recompute on render / interval).
  - "Sharia Link" toggle is an ambient workspace setting (ethical screening +
    NIMC sync on/off); persisted per officer, not per case. Off → the auto-check
    card shows "sync disabled" and Approve still works (manual review).
  - Priority "HIGH PRIORITY" badge = destructive-subtle tone; "STANDARD" =
    default tone.
  - AutoCheck: passed → success tone, flagged → warning, failed → destructive.
    A `failed` auto-check does not block Approve but surfaces a confirm step.
  - "Audit Log" opens the case's append-only entries (latest-of-list). "Sharia
    Profile" opens the applicant's Sharia record — TODO(design): destination
    undefined; v1 routes to the member detail.

Side Effects:
  - Approve / Reject → one mutation `decideCase({ id, decision, notes,
    checklist, version })`. onSuccess → invalidate KYC_QUERY_KEYS.all
    (queue + detail + auditLog) + `toast.success`. onError →
    `toast.error(getApiErrorMessage(...))`. Both toasts always present.
  - After a decision the case is removed from the queue; auto-select the next
    case (or show an empty state if the queue is drained).
  - Toggling a checklist item → local draft state; persisted only as part of the
    decision mutation (no per-tick request in v1 — TODO(api-contract): autosave).
  - "Sharia Link" toggle → a settings mutation (its own key); optimistic UI is
    fine here (non-critical).
  - Notes field → local draft; submitted with the decision.

Edge Cases / Failure Modes:
  - Empty queue → the queue column shows "No cases awaiting review" and the
    review pane shows an empty state.
  - Selected case decided in another tab → detail refetch returns a terminal
    status → review pane replaces the buttons with "Decided by <actor> ·
    <when>" and a "Back to queue" action.
  - Approve attempted with an incomplete checklist → button stays disabled; if
    somehow submitted, server rejects and the error toast explains.
  - Reject with an empty note → inline field error, mutation not fired.
  - AutoCheck still running (status pending) → show a "Checks running…" state;
    Approve allowed only after it resolves, Reject always allowed.
  - Document fails to load → show a "Preview unavailable — download" fallback,
    never a broken image.
  - Long applicant name / application label → truncate with title tooltip.
  - Timer for a case enqueued in the future / bad date → show "—".

Concurrency:
  - OPTIMISTIC LOCKING (CLAUDE.md — decided by more than one actor): the decision
    mutation sends the `version` the UI last fetched. On a server version
    mismatch → refetch the case, DO NOT apply the decision, and
    `toast.error("This case was updated elsewhere — review again before
    deciding.")`.
  - Decisions are append-only: a case already `approved`/`rejected` cannot be
    re-decided from this screen (buttons gone). Corrections go through a
    separate re-open flow (not designed — TODO).
  - Double-submit guarded by the mutation `isPending` → Button `isLoading`;
    both Approve and Reject share the pending lock.
  - Two officers opening the same case: both can view; the first decision wins,
    the second gets the version-mismatch toast.

Observability:
  - Query keys: KYC_QUERY_KEYS.all / .queue(params) / .detail(id) /
    .auditLog(id).
  - Every decision writes an AuditEntry with `resourceType: "kyc_case"`,
    recording decision, which checklist items were ticked, the note, the
    auto-check result snapshot, and actor + timestamp.
  - "Sharia Link" toggles are audited as settings changes (actor + on/off).
  - No applicant PII (name, NIN, BVN, document contents) in client logs.
```

## Implementation note (v1)

No backend. `lib/mock-data.ts` = in-memory queue + `mockQueue/Detail/AuditLog`
and a `mockDecide` that flips status, appends an audit entry, and drops the case
from the queue. `controllers/kycController.ts` wraps them in real
`useQuery`/`useMutation` (keys, invalidation, both toasts). Optimistic-locking,
per-tick checklist autosave, and the real document renderer are `TODO(api-contract)`
stubs. Checklist + notes live in local draft state and submit with the decision.
