import { AppShell } from "../../components/app-shell";
import { PlanGate } from "../../components/plan-gate";
import { IntegrationsConsole } from "../../components/integrations-console";
import { ReferenceModuleHeader } from "../../components/reference-module";
import { ReferenceFlowStrip } from "../../components/reference-sections";
import { IntegrationsWorkflowWorkspace } from "../../components/reference-workspaces";
import { Cloud, Fingerprint, Mail, PlugZap } from "lucide-react";

export default function IntegrationsPage() {
  return (
    <AppShell title="Integrations" subtitle="Email, WhatsApp, biometric, geo attendance, S3 storage and bank export connectors.">
      <ReferenceModuleHeader
        eyebrow="Integrations"
        title="Integration Center"
        summary="Connect email, WhatsApp, biometric, geo attendance, storage and payroll bank export systems."
        tabs={["Connectors", "Communication", "Attendance", "Storage", "Bank Export"]}
        activeTab="Connectors"
        actions={[
          { label: "Test Connector", icon: <PlugZap className="h-4 w-4" />, tone: "primary" },
          { label: "Email", icon: <Mail className="h-4 w-4" /> },
          { label: "Biometric", icon: <Fingerprint className="h-4 w-4" /> },
          { label: "Storage", icon: <Cloud className="h-4 w-4" /> },
        ]}
        stats={[
          { label: "Connectors", value: "Live", note: "API source" },
          { label: "Tests", value: "Audit", note: "Logged" },
          { label: "Status", value: "Ready", note: "Configurable" },
        ]}
      />
      <PlanGate moduleName="Integrations" requiredPlan="Pro">
        <ReferenceFlowStrip module="Integrations" />
        <IntegrationsWorkflowWorkspace />
        <IntegrationsConsole />
      </PlanGate>
    </AppShell>
  );
}
