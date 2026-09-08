import { Suspense } from "react";

import { SettingsView } from "@/modules/settings/views/SettingsView";

export default function SettingsPage() {
  return (
    <Suspense fallback={null}>
      <SettingsView />
    </Suspense>
  );
}
