"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { APP_ROUTES, SETTINGS_TABS } from "@/constants/routes";
import { NotificationsTab } from "@/modules/settings/components/notifications/NotificationsTab";
import { RolesTab } from "@/modules/settings/components/roles/RolesTab";
import { SecurityTab } from "@/modules/settings/components/security/SecurityTab";
import { SystemConfigTab } from "@/modules/settings/components/systemConfig/SystemConfigTab";
import { UserManagementTab } from "@/modules/settings/components/userManagement/UserManagementTab";

const TABS = [
  { value: SETTINGS_TABS.SECURITY, label: "Security" },
  { value: SETTINGS_TABS.NOTIFICATIONS, label: "Notification" },
  { value: SETTINGS_TABS.USER_MANAGEMENT, label: "User Management" },
  { value: SETTINGS_TABS.ROLES_PERMISSIONS, label: "Roles & Permissions" },
  { value: SETTINGS_TABS.SYSTEM_CONFIGURATION, label: "System Configuration" },
] as const;

const VALID_TABS = new Set<string>(TABS.map((tab) => tab.value));

export function SettingsView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requested = searchParams.get("tab") ?? "";
  const active = VALID_TABS.has(requested) ? requested : SETTINGS_TABS.SECURITY;

  const onTabChange = (value: string) => {
    router.replace(`${APP_ROUTES.SETTINGS}?tab=${value}`);
  };

  return (
    <div className="space-y-6">
      <Tabs value={active} onValueChange={onTabChange}>
        <TabsList className="flex-wrap w-fit">
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={SETTINGS_TABS.SECURITY} className="mt-6">
          <SecurityTab />
        </TabsContent>

        <TabsContent value={SETTINGS_TABS.ROLES_PERMISSIONS} className="mt-6">
          <RolesTab />
        </TabsContent>

        <TabsContent value={SETTINGS_TABS.NOTIFICATIONS} className="mt-6">
          <NotificationsTab />
        </TabsContent>

        <TabsContent value={SETTINGS_TABS.USER_MANAGEMENT} className="mt-6">
          <UserManagementTab />
        </TabsContent>

        <TabsContent
          value={SETTINGS_TABS.SYSTEM_CONFIGURATION}
          className="mt-6"
        >
          <SystemConfigTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
