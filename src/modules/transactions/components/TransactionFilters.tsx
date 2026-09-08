"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  COMPLIANCE_OPTIONS,
  DATE_RANGE_OPTIONS,
  PRODUCT_OPTIONS,
} from "@/modules/transactions/lib/validators";
import type {
  TransactionCompliance,
  TransactionDateRange,
  TransactionProduct,
} from "@/modules/transactions/types";

export interface TransactionFilterState {
  dateRange: TransactionDateRange;
  compliance: TransactionCompliance | "all";
  product: TransactionProduct | "all";
  client: string;
  amountMin: string;
  amountMax: string;
}

interface TransactionFiltersProps {
  value: TransactionFilterState;
  onChange: <K extends keyof TransactionFilterState>(
    key: K,
    next: TransactionFilterState[K],
  ) => void;
}

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

export function TransactionFilters({
  value,
  onChange,
}: TransactionFiltersProps) {
  return (
    <div className="grid gap-4 rounded-xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-5">
      <Field label="Date Range">
        <Select
          value={value.dateRange}
          onValueChange={(next) =>
            onChange("dateRange", next as TransactionDateRange)
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DATE_RANGE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field label="Compliance Status">
        <Select
          value={value.compliance}
          onValueChange={(next) =>
            onChange("compliance", next as TransactionCompliance | "all")
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {COMPLIANCE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field label="Amount Range">
        <div className="flex items-center gap-2">
          <Input
            inputMode="numeric"
            placeholder="Min"
            value={value.amountMin}
            onChange={(event) => onChange("amountMin", event.target.value)}
          />
          <Input
            inputMode="numeric"
            placeholder="Max"
            value={value.amountMax}
            onChange={(event) => onChange("amountMax", event.target.value)}
          />
        </div>
      </Field>

      <Field label="Client ID/Name">
        <Input
          placeholder="Search entity…"
          value={value.client}
          onChange={(event) => onChange("client", event.target.value)}
        />
      </Field>

      <Field label="Product Type">
        <Select
          value={value.product}
          onValueChange={(next) =>
            onChange("product", next as TransactionProduct | "all")
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Products</SelectItem>
            {PRODUCT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    </div>
  );
}
