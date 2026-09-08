"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AUDIT_ADMIN_OPTIONS,
  AUDIT_MODULE_OPTIONS,
} from "@/modules/auditTrail/lib/mock-data";
import type { AuditAction } from "@/modules/auditTrail/types";

export interface AuditFilterDraft {
  admin: string;
  action: AuditAction | "all";
  module: string;
  startDate: string;
  endDate: string;
}

const ACTION_OPTIONS: { value: AuditAction | "all"; label: string }[] = [
  { value: "all", label: "All Actions" },
  { value: "update", label: "Update" },
  { value: "create", label: "Create" },
  { value: "delete", label: "Delete" },
  { value: "security_login", label: "Security Login" },
];

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <span className="text-xs font-medium text-text-secondary">{label}</span>
      {children}
    </div>
  );
}

interface AuditFiltersProps {
  onApply: (draft: AuditFilterDraft) => void;
}

export function AuditFilters({ onApply }: AuditFiltersProps) {
  const [draft, setDraft] = React.useState<AuditFilterDraft>({
    admin: "all",
    action: "all",
    module: "all",
    startDate: "",
    endDate: "",
  });

  const set = <K extends keyof AuditFilterDraft>(
    key: K,
    value: AuditFilterDraft[K],
  ) => setDraft((current) => ({ ...current, [key]: value }));

  return (
    <Card className="p-4">
      <p className="mb-3 text-sm font-semibold text-foreground">
        Search Filters
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Admin User">
          <Select
            value={draft.admin}
            onValueChange={(value) => set("admin", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AUDIT_ADMIN_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Action Type">
          <Select
            value={draft.action}
            onValueChange={(value) =>
              set("action", value as AuditAction | "all")
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ACTION_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Sharia Module">
          <Select
            value={draft.module}
            onValueChange={(value) => set("module", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AUDIT_MODULE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Start Date">
          <Input
            type="date"
            value={draft.startDate}
            onChange={(event) => set("startDate", event.target.value)}
          />
        </Field>

        <Field label="End Date">
          <Input
            type="date"
            value={draft.endDate}
            onChange={(event) => set("endDate", event.target.value)}
          />
        </Field>

        <div className="flex items-end">
          <Button className="w-full" onClick={() => onApply(draft)}>
            Apply Filter
          </Button>
        </div>
      </div>
    </Card>
  );
}
