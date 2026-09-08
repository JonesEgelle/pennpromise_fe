"use client";

import * as React from "react";
import { FileText, ImageOff } from "lucide-react";

import { cn } from "@/lib/utils";
import type { KycDocument } from "@/modules/kyc/types";

/**
 * Document chips + preview. v1 shows a placeholder — TODO(api-contract): render
 * the real image / PDF from `document.url` once documents are served. These are
 * uploaded FILES, never inline HTML.
 */
export function DocumentPreview({ documents }: { documents: KycDocument[] }) {
  const [activeId, setActiveId] = React.useState(documents[0]?.id ?? null);
  const active = documents.find((doc) => doc.id === activeId) ?? documents[0];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {documents.map((doc) => (
          <button
            key={doc.id}
            type="button"
            onClick={() => setActiveId(doc.id)}
            className={cn(
              "max-w-[12rem] truncate rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
              doc.id === active?.id
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-text-secondary hover:bg-muted/50",
            )}
          >
            {doc.label}
          </button>
        ))}
      </div>

      <div className="grid aspect-[4/3] w-full place-items-center rounded-xl border border-border bg-muted/40 text-muted-foreground">
        {active ? (
          <div className="flex flex-col items-center gap-2 text-center">
            <FileText className="size-8" aria-hidden />
            <p className="text-xs">{active.label}</p>
            <p className="text-[11px]">Preview unavailable — download</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <ImageOff className="size-8" aria-hidden />
            <p className="text-xs">No documents</p>
          </div>
        )}
      </div>
    </div>
  );
}
