import * as React from "react";
import { Construction } from "lucide-react";

/**
 * Temporary empty-state for a module whose dossier + UI haven't been built yet.
 * Replace with the real view — do not ship this to production.
 */
export function PlaceholderPanel({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="grid place-items-center rounded-xl border border-dashed border-border bg-surface px-6 py-16 text-center">
      <Construction className="mb-3 size-6 text-muted-foreground" aria-hidden />
      <p className="text-sm font-medium text-foreground">
        This module is scaffolded but not built yet.
      </p>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        {children ??
          "Write the module dossier and resolve its open questions before adding UI (see CLAUDE.md → The habit)."}
      </p>
    </div>
  );
}
