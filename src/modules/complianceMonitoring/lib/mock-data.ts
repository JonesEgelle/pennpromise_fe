/**
 * Placeholder Compliance Monitoring data.
 * TODO(api-contract): replace with `services/compliance-monitoring.ts`.
 */
import type { ComplianceOverview } from "@/modules/complianceMonitoring/types";

export const COMPLIANCE_OVERVIEW_MOCK: ComplianceOverview = {
  integrityScore: 96.8,
  integrityDelta: 2.1,
  integrityBars: [40, 55, 48, 62, 70],
  statusCards: [
    {
      id: "halal-equity",
      title: "Halal Equity Monitoring",
      description: "12,450 trade entries screened for non-permissible income.",
      status: "halal_verified",
      progress: 88,
    },
    {
      id: "sukuk-ijarah",
      title: "Sukuk Al-Ijarah Validation",
      description: "15 pending underlying asset verification certificates.",
      status: "review_needed",
      progress: 46,
    },
    {
      id: "sharia-board-filings",
      title: "Sharia Board Filings",
      description: "Fatwa certifications renewed for 2024 products.",
      status: "optimal",
      progress: 96,
    },
    {
      id: "purification-audit",
      title: "Purification (Gharar) Audit",
      description: "2 minor interest-bearing accounts need purification.",
      status: "attention",
      progress: 30,
    },
  ],
  alerts: [
    {
      id: "riba-1",
      title: "Riba Alert: Prohibited Transaction",
      description:
        "Account associated with Ibrahim Yusuf flagged for ₦5M transfer from an interest-bearing source. Blocked for Sharia review.",
      at: "14:02 WAT",
      tags: ["STATUS: PROHIBITED", "SHARIA RIBA FLAG"],
      tone: "destructive",
    },
    {
      id: "rebalance-1",
      title: "Halal Equity Rebalancing",
      description:
        "Fatima Bello's portfolio requires rebalancing; MTN Nigeria debt-to-market cap ratio exceeded 33% limit.",
      at: "11:30 WAT",
      tags: ["STATUS: RE-BALANCE", "AAOIFI COMPLIANCE"],
      tone: "warning",
    },
  ],
  governanceDocs: [
    {
      id: "quarterly-audit",
      title: "Quarterly Sharia Audit Report",
      subtitle: "FOR SHARIA BOARD APPROVAL",
    },
    {
      id: "zakat-summary",
      title: "Zakat Assessment Summary",
      subtitle: "FISCAL YEAR 1445 AH",
    },
  ],
  ethicalLog: [
    {
      id: "log-1",
      title: "Sukuk Issued: Nasiru Gwarzo",
      description:
        "New Sukuk certificate issued and collateralized via real estate asset.",
      at: "18 MINS AGO",
      refId: "HALAL-7721",
    },
    {
      id: "log-2",
      title: "Purification Completed",
      description:
        "₦24,500 in interest income transferred to registered charity.",
      at: "1 HOUR AGO",
      refId: "PUR-0042",
    },
  ],
  alertsByType: [
    { label: "RIBA", count: 12, tone: "destructive" },
    { label: "HALAL", count: 48, tone: "info" },
    { label: "ZAKAT", count: 22, tone: "warning" },
  ],
  auditReadiness: {
    narrative:
      "Your Sukuk asset-backing records are 99% complete. One minor Murabaha contract for Amina Lawal is pending a digital signature.",
  },
};
