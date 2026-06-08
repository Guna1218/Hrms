import { AppShell } from "../../components/app-shell";
import { PlanGate } from "../../components/plan-gate";
import { SecurityConsole } from "../../components/security-console";
import { ReferenceModuleHeader } from "../../components/reference-module";
import { ReferenceFlowStrip } from "../../components/reference-sections";
import { SecurityAdminWorkflowWorkspace } from "../../components/reference-workspaces";
import { Eye, KeyRound, LockKeyhole, ShieldCheck } from "lucide-react";

export default function SecurityPage() {
  return (
    <AppShell title="Security & Admin Controls" subtitle="Protect employee, payroll and document data with permissions, audit logs and data controls.">
      <ReferenceModuleHeader
        eyebrow="Security"
        title="Security & Admin Controls"
        summary="2FA/OTP, role permissions, audit logs, payroll encryption, document security and admin controls."
        tabs={["Controls", "Roles", "Audit Logs", "Data Security"]}
        activeTab="Controls"
        actions={[
          { label: "Enable 2FA", icon: <KeyRound className="h-4 w-4" />, tone: "primary" },
          { label: "Roles", icon: <ShieldCheck className="h-4 w-4" /> },
          { label: "Audit", icon: <Eye className="h-4 w-4" /> },
          { label: "Encrypt", icon: <LockKeyhole className="h-4 w-4" /> },
        ]}
        stats={[
          { label: "RBAC", value: "On", note: "Permissions" },
          { label: "Audit", value: "Live", note: "Activity" },
          { label: "Data", value: "Secure", note: "Docs/payroll" },
        ]}
      />
      <PlanGate moduleName="Security & Admin Controls" requiredPlan="Pro">
        <ReferenceFlowStrip module="Security" />
        <SecurityAdminWorkflowWorkspace />
        <SecurityConsole />
      </PlanGate>
    </AppShell>
  );
}
