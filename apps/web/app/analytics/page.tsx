import { AnalyticsConsole } from "../../components/analytics-console";
import { AppShell } from "../../components/app-shell";
import { PlanGate } from "../../components/plan-gate";
import { ReferenceModuleHeader } from "../../components/reference-module";
import { ReferenceFlowStrip } from "../../components/reference-sections";
import { AnalyticsWorkflowWorkspace } from "../../components/reference-workspaces";
import { BadgeIndianRupee, Download, Target, Users } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <AppShell title="Advanced Analytics" subtitle="Executive HRMS insights for workforce, attendance, payroll, expenses and hiring.">
      <ReferenceModuleHeader
        eyebrow="Analytics"
        title="Advanced Analytics"
        summary="Executive insights for workforce, attendance, payroll, expenses, compliance and hiring trends."
        tabs={["Overview", "Workforce", "Attendance", "Payroll", "Hiring"]}
        activeTab="Overview"
        actions={[
          { label: "Workforce", icon: <Users className="h-4 w-4" />, tone: "primary" },
          { label: "Payroll", icon: <BadgeIndianRupee className="h-4 w-4" /> },
          { label: "Insights", icon: <Target className="h-4 w-4" /> },
          { label: "Export", icon: <Download className="h-4 w-4" /> },
        ]}
        stats={[
          { label: "Insights", value: "Live", note: "API source" },
          { label: "Modules", value: "Core", note: "HRMS data" },
          { label: "Export", value: "Ready", note: "Reports" },
        ]}
      />
      <PlanGate moduleName="Advanced Analytics" requiredPlan="Pro">
        <ReferenceFlowStrip module="Analytics" />
        <AnalyticsWorkflowWorkspace />
        <AnalyticsConsole />
      </PlanGate>
    </AppShell>
  );
}
