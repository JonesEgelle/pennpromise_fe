import * as React from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SettingsSectionProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  /**
   * Render as a plain block (no Card shell) so several sections can share one
   * outer container — used by the Security tab.
   */
  bare?: boolean;
}

/** A titled settings block: heading + description left, actions right. */
export function SettingsSection({
  title,
  description,
  actions,
  children,
  className,
  bare,
}: SettingsSectionProps) {
  const content = (
    <>
      <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        ) : null}
      </div>
      <div className="space-y-5 p-5">{children}</div>
    </>
  );

  if (bare) {
    return <div className={cn(className)}>{content}</div>;
  }

  return <Card className={cn("overflow-hidden", className)}>{content}</Card>;
}

interface SettingsFieldProps {
  label: string;
  htmlFor?: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Label on the left, control centred; dashed rule below every row but the last.
 * Stacks to a single column below `sm`.
 */
export function SettingsField({
  label,
  htmlFor,
  hint,
  children,
}: SettingsFieldProps) {
  return (
    <div className="grid gap-2 border-b-2 border-dashed border-border pb-5 last:border-b-0 last:pb-0 sm:grid-cols-[1fr_minmax(0,360px)_1fr] sm:gap-4">
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium text-text-secondary sm:pt-2"
      >
        {label}
      </label>
      <div className="space-y-2">
        {children}
        {hint}
      </div>
    </div>
  );
}
