# Module dossier — Settings

Figma: `Settings - Security` `548:9098`, `Settings - Roles & Permission`
`548:9538` (both captured). `Settings - Notification` `548:9287`, `Settings -
User Management` `548:9379`, `Settings - System Configuration` `548:9916` — NOT
captured (Figma MCP rate-limited). Route `/settings?tab=<tab>`.

```
Feature:
  Operator settings for the admin console, five tabs: Security (own credentials),
  Notifications, User Management (admin-console operators), Roles & Permissions
  (granular Sharia-module access control), System Configuration.

Business Goal:
  Let admins secure their own access, manage who else operates the console and
  what each can do, and tune platform-wide config — all audited.

Actors:
  - Administrator — full access to every tab; the only role that can edit Roles
    & Permissions and User Management.
  - Compliance / Ops operators — Security tab (self) always; other tabs per
    their granted permissions.

Entities & States:
  SECURITY
  - PasswordChange { oldPassword, newPassword, confirmPassword }. Strength rules
    (shown as a live checklist): ≥8 chars, ≥1 lowercase, ≥1 uppercase, ≥1 symbol.
  - PasscodeChange { oldPasscode, newPasscode, confirmPasscode } — 4-digit
    numeric transaction PIN.
  - TfaSetup { secretKey, otpauthUrl, code } — authenticator-app enrolment;
    `code` is the 6-digit verification.

  ROLES & PERMISSIONS
  - Role { id, name ("Zonal Admin (North)"), description, mfa ∈ {mandatory,
    optional}, version }.
  - PermissionMatrix: rows = Sharia modules ("Halal Equity (Naira)", "BVN &
    Sharia ID Validation", "Sukuk Transfer", "Sharia Board Reporting"); columns
    = { view, create, edit, delete, export } booleans + per-row `shariaMfa` ∈
    {mandatory, optional}.
  - ChangeLogEntry { id, at, title, detail, kind ∈ {matrix_update, role_created,
    unauthorized_access} }.
  - Security stats: totalRoles, ethicalPermissions, mfaEnforced, auditFrequency.

  USER MANAGEMENT (design pending)
  - AdminUser { id, name, email, role, status, isSelf, isLastAdministrator }.

Rules:
  - SECURITY tab is always self-scoped; never edits another operator.
  - Password: new ≠ old; confirm must match; all four strength rules must pass
    before Save enables.
  - Passcode: exactly 4 digits; confirm must match.
  - TFA: 6-digit code required to finish enrolment; the secret key is shown once
    with a copy affordance + "View Barcode/QR Code".
  - ROLES: selecting a role loads its matrix; checkbox toggles are a LOCAL DRAFT
    until Save. "Create New Role" opens a modal (name + description; starts with
    an empty matrix).
  - Role edits use OPTIMISTIC LOCKING (CLAUDE.md — decided by more than one
    actor): Save sends the role `version` last fetched; on mismatch, refetch the
    matrix, block the write, `toast.error("This role was changed elsewhere —
    review and retry.")`.
  - USER MANAGEMENT self-action DOUBLE GUARD (CLAUDE.md): an operator cannot
    remove/demote themselves AND the last Administrator cannot be removed —
    disable the affordance (`disabled` callback) AND re-check inside the handler.
  - Every tab's Save has both a success and an error toast.

Side Effects:
  - Change password / passcode / enable TFA → mutations; onSuccess resets the
    form + success toast; onError → error toast. No optimistic UI.
  - Save role matrix / create role → mutations; invalidate
    SETTINGS_QUERY_KEYS.roles (+ the role detail) + change log.
  - Every write appends an audit entry (`resourceType: "role"` | `"admin_user"`
    | `"security"`), captured in the Change Log & Audit Matrix.

Edge Cases / Failure Modes:
  - Unknown `?tab=` value → fall back to "security".
  - Password confirm mismatch / weak password → inline field errors, Save
    disabled.
  - Passcode with non-digits or wrong length → inline error.
  - Role with zero permissions saved → allowed (a view-only shell) but warned.
  - Removing the last Administrator / self → blocked with a toast, never a silent
    no-op.
  - Change log empty → "No changes recorded yet."

Concurrency:
  - Role matrix: optimistic locking as above; two admins editing the same role
    → first Save wins, second gets the version-mismatch toast + refetch.
  - Security forms are self-scoped → no cross-actor race.
  - Double-submit guarded by mutation `isPending` → Button `isLoading`.

Observability:
  - Query keys: SETTINGS_QUERY_KEYS.all / .roles / .roleMatrix(id) / .changeLog
    / .securityStats / .notifications / .systemConfig / .adminUsers.
  - Audit entries carry a specific `resourceType` (role | admin_user | security |
    system_config) — never a generic "settings" bucket (CLAUDE.md).
  - No secrets in logs: never log passwords, passcodes, or the TFA secret.
```

## Implementation status (v1)

- **Security** and **Roles & Permissions** tabs: built, presentational, mock-backed
  (`lib/mock-data.ts` + `controllers/settingsController.ts` wrapping mocks in real
  `useQuery`/`useMutation`). Optimistic locking + real crypto flows are
  `TODO(api-contract)`.
- **Notifications**, **User Management**, **System Configuration** tabs: informed
  placeholders — Figma frames not yet captured (MCP rate limit). The dossier
  rows above hold the known shape; build when screenshots are available.
