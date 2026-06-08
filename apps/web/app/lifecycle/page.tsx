import { AppShell } from "../../components/app-shell";
import { ReferenceModuleHeader } from "../../components/reference-module";
import { ReferenceFlowStrip } from "../../components/reference-sections";
import { LifecycleWorkflowWorkspace } from "../../components/reference-workspaces";
import { LifecycleConsole } from "../../components/lifecycle-console";
import { ClipboardCheck, FileCheck2, LogOut, UserPlus } from "lucide-react";

export default function LifecyclePage() {
  return (
    <AppShell title="Lifecycle" subtitle="Onboarding, joining workflow, document collection, probation readiness and exit clearance.">
      <ReferenceModuleHeader
        eyebrow="Lifecycle"
        title="Employee Lifecycle"
        summary="Onboarding, joining, document collection, probation tracking, exit clearance and final settlement."
        tabs={["Onboarding", "Joining", "Probation", "Exit"]}
        activeTab="Onboarding"
        actions={[
          { label: "Start Joining", icon: <UserPlus className="h-4 w-4" />, tone: "primary" },
          { label: "Documents", icon: <FileCheck2 className="h-4 w-4" /> },
          { label: "Checklist", icon: <ClipboardCheck className="h-4 w-4" /> },
          { label: "Exit", icon: <LogOut className="h-4 w-4" /> },
        ]}
        stats={[
          { label: "Onboarding", value: "Live", note: "Workflow" },
          { label: "Documents", value: "Linked", note: "Verification" },
          { label: "Exit", value: "Clearance", note: "Assets/payroll" },
        ]}
      />
      <ReferenceFlowStrip module="Lifecycle" />
      <LifecycleWorkflowWorkspace />
      <LifecycleConsole />
    </AppShell>
  );
}
