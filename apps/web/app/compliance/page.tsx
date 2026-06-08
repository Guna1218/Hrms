import { AppShell } from "../../components/app-shell";
import { PlanGate } from "../../components/plan-gate";
import { ReferenceModuleHeader } from "../../components/reference-module";
import { ReferenceFlowStrip } from "../../components/reference-sections";
import { ComplianceWorkflowWorkspace } from "../../components/reference-workspaces";
import { ComplianceConsole } from "../../components/compliance-console";
import { Download, FileText, Landmark, ShieldCheck } from "lucide-react";

export default function CompliancePage() {
  return (
    <AppShell title="Compliance" subtitle="PF, ESI, Professional Tax, TDS, Form 16 and labour-law readiness.">
      <ReferenceModuleHeader
        eyebrow="Compliance"
        title="Statutory Compliance"
        summary="PF, ESI, Professional Tax, TDS, Form 16 and labour law reports from payroll-ready employee data."
        tabs={["Overview", "PF", "ESI", "PT", "TDS", "Form 16"]}
        activeTab="Overview"
        actions={[
          { label: "Validate", icon: <ShieldCheck className="h-4 w-4" />, tone: "primary" },
          { label: "Statutory", icon: <Landmark className="h-4 w-4" /> },
          { label: "Form 16", icon: <FileText className="h-4 w-4" /> },
          { label: "Export", icon: <Download className="h-4 w-4" /> },
        ]}
        stats={[
          { label: "Payroll", value: "Linked", note: "Source" },
          { label: "Checks", value: "5", note: "Statutory" },
          { label: "Export", value: "Ready", note: "Reports" },
        ]}
      />
      <PlanGate moduleName="Compliance" requiredPlan="Pro">
        <ReferenceFlowStrip module="Compliance" />
        <ComplianceWorkflowWorkspace />
        <ComplianceConsole />
      </PlanGate>
    </AppShell>
  );
}
