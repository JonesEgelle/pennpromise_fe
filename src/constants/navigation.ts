import {
  UsersIcon,
  KycIcon,
  TransactionsIcon,
  FinancialReconciliationIcon,
  ComplianceMonitoringIcon,
  PlatformAnalyticsIcon,
  SystemHealthIcon,
  AuditTrailIcon,
  SettingsIcon,
} from "@/components/icons/navigation-icons";
import type { ComponentType, SVGProps } from "react";

export type Icon = ComponentType<SVGProps<SVGSVGElement>>;

import { APP_ROUTES } from "@/constants/routes";

export interface NavItem {
  label: string;
  href: string;
  icon: Icon;
  /** Permission slug required to see this item. Enforcement is wired later. */
  permission?: string;
}

export const PRIMARY_NAV: NavItem[] = [
  { label: "Users", href: APP_ROUTES.USERS, icon: UsersIcon },
  { label: "KYC & BVN", href: APP_ROUTES.KYC, icon: KycIcon },
  {
    label: "Transactions",
    href: APP_ROUTES.TRANSACTIONS,
    icon: TransactionsIcon,
  },
  {
    label: "Financial Reconciliation",
    href: APP_ROUTES.FINANCIAL_RECONCILIATION,
    icon: FinancialReconciliationIcon,
  },
  {
    label: "Compliance Monitoring",
    href: APP_ROUTES.COMPLIANCE_MONITORING,
    icon: ComplianceMonitoringIcon,
  },
  {
    label: "Platform Analysis",
    href: APP_ROUTES.PLATFORM_ANALYTICS,
    icon: PlatformAnalyticsIcon,
  },
  {
    label: "System Health & Monitoring",
    href: APP_ROUTES.SYSTEM_HEALTH,
    icon: SystemHealthIcon,
  },
  {
    label: "Audit Trail & Logging",
    href: APP_ROUTES.AUDIT_TRAIL,
    icon: AuditTrailIcon,
  },
];

export const SECONDARY_NAV: NavItem[] = [
  { label: "Settings", href: APP_ROUTES.SETTINGS, icon: SettingsIcon },
];
