"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, formatDate } from "@/lib/utils";
import {
  useSaveSystemConfig,
  useSystemConfig,
} from "@/modules/settings/controllers/settingsController";
import type { SystemConfig } from "@/modules/settings/types";

const TIMEZONES = [
  { value: "wat", label: "West Africa Time (WAT)" },
  { value: "utc", label: "Coordinated Universal Time (UTC)" },
  { value: "gmt", label: "Greenwich Mean Time (GMT)" },
];
const CURRENCIES = [
  { value: "ngn", label: "NGN — Nigerian Naira (₦)" },
  { value: "usd", label: "USD — US Dollar ($)" },
];

function ConfigForm({ config }: { config: SystemConfig }) {
  const [draft, setDraft] = React.useState(config);
  const save = useSaveSystemConfig();
  const dirty = JSON.stringify(draft) !== JSON.stringify(config);

  const setGeneral = <K extends keyof SystemConfig["general"]>(
    key: K,
    value: SystemConfig["general"][K],
  ) =>
    setDraft((current) => ({
      ...current,
      general: { ...current.general, [key]: value },
    }));

  const toggleNotification = (key: string, enabled: boolean) =>
    setDraft((current) => ({
      ...current,
      notifications: current.notifications.map((row) =>
        row.key === key ? { ...row, enabled } : row,
      ),
    }));

  const toggleFlag = (key: string, enabled: boolean) =>
    setDraft((current) => ({
      ...current,
      featureFlags: current.featureFlags.map((row) =>
        row.key === key ? { ...row, enabled } : row,
      ),
    }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            System Configuration
          </h2>
          <p className="text-sm text-muted-foreground">
            Global system settings, branding, and API integrations.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!dirty || save.isPending}
            onClick={() => setDraft(config)}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            isLoading={save.isPending}
            disabled={!dirty}
            onClick={() => save.mutate(draft)}
          >
            Save
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left column */}
        <div className="space-y-6">
          <Card className="space-y-4 p-5">
            <h3 className="text-sm font-semibold text-foreground">
              General Settings
            </h3>
            <div className="space-y-1.5">
              <label
                htmlFor="org-name"
                className="text-xs font-medium text-text-secondary"
              >
                Organisation Name
              </label>
              <Input
                id="org-name"
                value={draft.general.organisationName}
                onChange={(event) =>
                  setGeneral("organisationName", event.target.value)
                }
              />
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-medium text-text-secondary">
                Timezone
              </span>
              <Select
                value={draft.general.timezone}
                onValueChange={(value) => setGeneral("timezone", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-medium text-text-secondary">
                Base Currency
              </span>
              <Select
                value={draft.general.baseCurrency}
                onValueChange={(value) => setGeneral("baseCurrency", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                Recent Sharia Advisory Changes
              </h3>
              <button
                type="button"
                className="text-xs font-medium text-info hover:underline"
              >
                View Audit Logs
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="py-2 pr-3 font-medium">Authorized User</th>
                    <th className="py-2 pr-3 font-medium">Adjustment</th>
                    <th className="py-2 pr-3 font-medium">Previous</th>
                    <th className="py-2 pr-3 font-medium">New Status</th>
                    <th className="py-2 font-medium">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {config.advisoryChanges.map((change) => (
                    <tr
                      key={change.id}
                      className="border-b border-border last:border-b-0"
                    >
                      <td className="py-2 pr-3 font-medium text-foreground">
                        {change.authorizedUser}
                      </td>
                      <td className="py-2 pr-3 text-text-secondary">
                        {change.adjustment}
                      </td>
                      <td className="py-2 pr-3 text-muted-foreground">
                        {change.previousStatus}
                      </td>
                      <td className="py-2 pr-3 font-medium text-primary">
                        {change.newStatus}
                      </td>
                      <td className="py-2 text-muted-foreground">
                        {formatDate(change.at, "datetime")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <Card className="p-5">
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              Notification Preferences
            </h3>
            <ul className="divide-y divide-border">
              {draft.notifications.map((row) => (
                <li
                  key={row.key}
                  className="flex items-center justify-between gap-4 py-2.5"
                >
                  <span className="text-sm text-text-secondary">
                    {row.label}
                  </span>
                  <Switch
                    checked={row.enabled}
                    onCheckedChange={(value) =>
                      toggleNotification(row.key, value)
                    }
                    aria-label={row.label}
                  />
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                Ethical Feature Flags
              </h3>
              <span className="rounded-md border border-border p-0.5 text-xs">
                <span className="rounded px-2 py-0.5 text-muted-foreground">
                  Staging
                </span>
                <span className="rounded bg-muted px-2 py-0.5 font-medium text-foreground">
                  Production
                </span>
              </span>
            </div>
            <ul className="space-y-3">
              {draft.featureFlags.map((flag) => (
                <li
                  key={flag.key}
                  className={cn(
                    "flex items-start justify-between gap-4 rounded-lg border border-border p-3",
                  )}
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {flag.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {flag.description}
                    </p>
                  </div>
                  <Switch
                    checked={flag.enabled}
                    onCheckedChange={(value) => toggleFlag(flag.key, value)}
                    aria-label={flag.label}
                    className="mt-0.5 shrink-0"
                  />
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function SystemConfigTab() {
  const { data, isLoading } = useSystemConfig();
  if (isLoading || !data) {
    return <Skeleton className="h-96 w-full rounded-xl" />;
  }
  return <ConfigForm config={data} />;
}
