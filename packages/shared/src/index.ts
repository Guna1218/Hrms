export const USER_PANELS = [
  "SUPER_ADMIN",
  "HR_ADMIN",
  "MANAGER",
  "EMPLOYEE",
] as const;

export const MODULES = [
  "AUTH",
  "DASHBOARD",
  "EMPLOYEES",
  "ATTENDANCE",
  "LEAVE",
  "PAYROLL",
  "REPORTS",
  "HOLIDAYS",
  "ORG_CHART",
  "EXPENSES",
  "INSURANCE",
  "CARDS",
  "FEED",
  "REWARDS",
  "SETTINGS",
  "ATS",
] as const;

export type UserPanel = (typeof USER_PANELS)[number];
export type PeopleOsModule = (typeof MODULES)[number];

export type PermissionAction =
  | "create"
  | "read"
  | "update"
  | "delete"
  | "approve"
  | "export"
  | "configure";

export interface DashboardMetrics {
  employeeCount: number;
  presentToday: number;
  pendingLeaves: number;
  payrollNetPay: number;
  pendingCompliance: number;
  pendingApprovals: number;
}
