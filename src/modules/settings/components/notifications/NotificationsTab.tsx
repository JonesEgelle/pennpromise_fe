"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { SettingsSection } from "@/modules/settings/components/SettingsSection";
import {
  useNotificationPrefs,
  useSaveNotificationPrefs,
} from "@/modules/settings/controllers/settingsController";
import type { NotificationPrefs } from "@/modules/settings/types";

const ROWS: { key: keyof NotificationPrefs; label: string; hint: string }[] = [
  {
    key: "email",
    label: "Enable Email Notification",
    hint: "Critical account-activity emails are always sent regardless of this setting.",
  },
  {
    key: "phone",
    label: "Enable Phone Notification",
    hint: "Allow SMS notifications to your phone number.",
  },
  {
    key: "inApp",
    label: "Enable In App Notification",
    hint: "You'll be notified about activities in the app.",
  },
];

function NotificationsForm({ prefs }: { prefs: NotificationPrefs }) {
  const [draft, setDraft] = React.useState(prefs);
  const save = useSaveNotificationPrefs();
  const dirty = JSON.stringify(draft) !== JSON.stringify(prefs);

  return (
    <SettingsSection
      title="Notification"
      description="We may still send you important notifications about your account outside of your notification settings."
      actions={
        <>
          <Button
            variant="outline"
            size="sm"
            disabled={!dirty || save.isPending}
            onClick={() => setDraft(prefs)}
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
        </>
      }
    >
      <ul className="divide-y divide-border">
        {ROWS.map((row) => (
          <li
            key={row.key}
            className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0"
          >
            <div className="flex items-start gap-3">
              <Switch
                checked={draft[row.key]}
                onCheckedChange={(value) =>
                  setDraft((current) => ({ ...current, [row.key]: value }))
                }
                className="mt-0.5"
                aria-label={row.label}
              />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {row.label}
                </p>
              </div>
            </div>
            <p className="max-w-sm text-right text-sm text-muted-foreground">
              {row.hint}
            </p>
          </li>
        ))}
      </ul>
    </SettingsSection>
  );
}

export function NotificationsTab() {
  const { data, isLoading } = useNotificationPrefs();

  if (isLoading || !data) {
    return <Skeleton className="h-64 w-full rounded-xl" />;
  }
  return <NotificationsForm prefs={data} />;
}
