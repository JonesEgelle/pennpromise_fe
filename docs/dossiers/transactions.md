# Module dossier — Transactions (Transaction Monitoring)

Figma: `Transactions` — light `577:3761` (1920×1208), dark `619:1887`. File
`trKJGlm0ZiTGsGsFwrtwdJ`. Route `/transactions`, page title "Transaction
Monitoring".

```
Feature:
  A filtered ledger of asset-flow transactions across the Nigerian platform,
  with each row's Sharia/AML compliance state surfaced. Officers filter by date,
  compliance state, amount band, client, and product; they can add a record,
  amend one, or void one, and export the filtered set to CSV.

Business Goal:
  Give compliance and finance a monitoring view of money movement — spot flagged
  / blocked transactions fast, drill by client or product, and produce an
  auditable export for SEC / AAOIFI.

Actors:
  - Compliance Officer (primary) — filters, reviews, amends compliance state,
    exports.
  - Finance Admin — adds / corrects records.
  - Support Staff — read-only.

Entities & States:
  - Transaction: id, contractId (e.g. "SK-67830000177"), timestamp, client
    { name, bvnMasked }, product, amountNgn, compliance, updatedAt.
  - product ∈ {bonds, sukuk, equity, murabaha, ijarah} (inferred — Figma shows
    only "Bonds"). TODO(api-contract).
  - compliance ∈ {cleared, flagged, under_review, blocked} (inferred — Figma
    shows only "Flagged"). cleared → success, flagged → warning, under_review →
    default, blocked → destructive (one place: shared StatusBadge).
  - List params (ALL server-side): { page, pageSize, dateRange, compliance,
    product, client, amountMin, amountMax }.
  - dateRange ∈ {last_24_hours, last_7_days, last_30_days, last_90_days,
    all_time}.

Rules:
  - Server-side pagination + filtering from the first commit; text (client) and
    amount inputs are debounced via the shared `useDebounce`; any filter change
    resets to page 1.
  - Amount inputs stay STRINGS in component/form state; parsed to a number only
    at the params / API boundary (CLAUDE.md). Non-numeric → treated as "no
    bound".
  - BVN is displayed already masked ("2221********918") — the client never
    un-masks it; never log it.
  - Amount rendered with `formatNairaАmount` (full ₦, grouped, 2dp) — not the
    compact `formatNaira`.
  - Timestamp rendered with `formatDate(value, "datetime")`.
  - Compliance renders through the shared `StatusBadge`.
  - Row actions: Edit (pencil) + Delete/void (trash), inline icons (Figma), not
    the ⋮ menu. No row-detail overlay is designed.
  - CRUD completeness: list + create ("Add New Record") + edit + void all ship
    together (CLAUDE.md).
  - "Amount Range" second input is labelled "Min" in the design — that is a bug;
    it is the MAX.

Side Effects:
  - Create / Update / Void → TanStack mutations. onSuccess → invalidate
    TRANSACTIONS_QUERY_KEYS.all + `toast.success`. onError →
    `toast.error(getApiErrorMessage(...))`. Both toasts always present.
  - Export CSV → async job with the active filters; pending/success/error state
    from a mutation, success toast carries the download. (v1: stub.)

Edge Cases / Failure Modes:
  - No matches → DataTable empty state, pagination hidden.
  - amountMin > amountMax → server returns 0 rows; the UI does not pre-validate
    (keeps the filter honest) but could warn — TODO.
  - Page beyond range after a void on the last page → clamp to the new last
    page.
  - Very large amounts → `Intl` grouping handles it; NaN / null → "—".
  - Long client name / contract id → truncate with a title tooltip.
  - Rapid filter changes → TanStack dedupes; `placeholderData: keepPreviousData`
    holds the previous page during load.

Concurrency:
  - IMMUTABILITY NOTE: financial transactions are normally append-only. The
    design draws pencil + trash per row, so v1 exposes edit/void, but the
    intended semantics are "amend compliance state + annotate" and "void"
    (soft), NOT hard mutation / hard delete. TODO(design): confirm; if the
    backend is append-only, edit becomes a status-change endpoint and delete
    becomes a void endpoint.
  - Double-submit guarded by mutation `isPending` → Button `isLoading`.
  - Two officers amending the same row → last write wins for v1; add optimistic
    locking (send `updatedAt`) when the compliance-state workflow is specced.

Observability:
  - Query keys: TRANSACTIONS_QUERY_KEYS.all / .list(params) / .detail(id).
  - Every mutation writes an audit entry with `resourceType: "transaction"`;
    compliance-state changes record before/after.
  - Export job logs actor + applied filters + row count.
  - No client PII (client name, BVN) in client logs.
```

## Implementation note (v1)

No backend. `lib/mock-data.ts` = in-memory store + async
`mockList/Create/Update/Delete`; `controllers/transactionsController.ts` wraps
them in real `useQuery`/`useMutation` (keys, `keepPreviousData`, both toasts).
`dateRange` filtering and the CSV export are `TODO(api-contract)` stubs.
Optimistic locking deferred until the compliance-state workflow is designed.
