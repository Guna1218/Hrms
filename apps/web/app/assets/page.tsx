import { AppShell } from "../../components/app-shell";
import { AssetsConsole } from "../../components/assets-console";
import { ReferenceModuleHeader } from "../../components/reference-module";
import { ReferenceFlowStrip } from "../../components/reference-sections";
import { AssetsWorkflowWorkspace } from "../../components/reference-workspaces";
import { CheckCircle2, Download, PackagePlus, UserRound } from "lucide-react";

export default function AssetsPage() {
  return (
    <AppShell title="Assets" subtitle="Company asset inventory, employee assignment and handover tracking.">
      <ReferenceModuleHeader
        eyebrow="Assets"
        title="Asset Management"
        summary="Track company assets, assignments, returns, handover status and audit history."
        tabs={["Inventory", "Assigned", "Handover", "Audit"]}
        activeTab="Inventory"
        actions={[
          { label: "Add Asset", icon: <PackagePlus className="h-4 w-4" />, tone: "primary" },
          { label: "Assign", icon: <UserRound className="h-4 w-4" /> },
          { label: "Return", icon: <CheckCircle2 className="h-4 w-4" /> },
          { label: "Export", icon: <Download className="h-4 w-4" /> },
        ]}
        stats={[
          { label: "Inventory", value: "Live", note: "Asset DB" },
          { label: "Handover", value: "Tracked", note: "Exit linked" },
          { label: "Audit", value: "On", note: "Movement logs" },
        ]}
      />
      <ReferenceFlowStrip module="Assets" />
      <AssetsWorkflowWorkspace />
      <AssetsConsole />
    </AppShell>
  );
}
