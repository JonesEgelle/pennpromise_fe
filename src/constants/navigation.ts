import {
  Activity,
  BarChart3,
  ClipboardList,
  Receipt,
  ScrollText,
  Settings,
  ShieldCheck,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import { APP_ROUTES } from "@/constants/routes";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Permission slug required to see this item. Enforcement is wired later. */
  permission?: string;
}

export const PRIMARY_NAV: NavItem[] = [
  { label: "Users", href: APP_ROUTES.USERS, icon: Users },
  { label: "KYC & BVN", href: APP_ROUTES.KYC, icon: ShieldCheck },
  { label: "Transactions", href: APP_ROUTES.TRANSACTIONS, icon: Receipt },
  {
    label: "Financial Reconciliation",
    href: APP_ROUTES.FINANCIAL_RECONCILIATION,
    icon: Wallet,
  },
  {
    label: "Compliance Monitoring",
    href: APP_ROUTES.COMPLIANCE_MONITORING,
    icon: Activity,
  },
  {
    label: "Platform Analysis",
    href: APP_ROUTES.PLATFORM_ANALYTICS,
    icon: BarChart3,
  },
  {
    label: "System Health & Monitoring",
    href: APP_ROUTES.SYSTEM_HEALTH,
    icon: ScrollText,
  },
  {
    label: "Audit Trail & Logging",
    href: APP_ROUTES.AUDIT_TRAIL,
    icon: ClipboardList,
  },
];

export const SECONDARY_NAV: NavItem[] = [
  { label: "Settings", href: APP_ROUTES.SETTINGS, icon: Settings },
];
