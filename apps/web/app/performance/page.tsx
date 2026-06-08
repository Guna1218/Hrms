import { AppShell } from "../../components/app-shell";
import { ReferenceModuleHeader } from "../../components/reference-module";
import { ReferenceFlowStrip } from "../../components/reference-sections";
import { PerformanceReviewWorkspace } from "../../components/reference-workspaces";
import { PerformanceConsole } from "../../components/performance-console";
import { CalendarCheck, Download, Star, Target } from "lucide-react";

export default function PerformancePage() {
  return (
    <AppShell title="Performance" subtitle="Goals, review readiness, ratings and appraisal cycle tracking.">
      <ReferenceModuleHeader
        eyebrow="PMS"
        title="Performance Management"
        summary="Goals, review cycles, attendance score, recognition signals and appraisal readiness."
        tabs={["Dashboard", "Goals", "Reviews", "Ratings"]}
        activeTab="Dashboard"
        actions={[
          { label: "New Cycle", icon: <CalendarCheck className="h-4 w-4" />, tone: "primary" },
          { label: "Goals", icon: <Target className="h-4 w-4" /> },
          { label: "Ratings", icon: <Star className="h-4 w-4" /> },
          { label: "Export", icon: <Download className="h-4 w-4" /> },
        ]}
        stats={[
          { label: "Cycle", value: "Live", note: "Review ready" },
          { label: "Signals", value: "4", note: "Score inputs" },
          { label: "Approval", value: "Manager", note: "HR lock" },
        ]}
      />
      <ReferenceFlowStrip module="PMS" />
      <PerformanceReviewWorkspace />
      <PerformanceConsole />
    </AppShell>
  );
}
