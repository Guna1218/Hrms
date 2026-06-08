import { AppShell } from "../../components/app-shell";
import { PlanGate } from "../../components/plan-gate";
import { AtsActionPanel } from "../../components/action-panels";
import { ReferenceModuleHeader } from "../../components/reference-module";
import { ReferenceFlowStrip } from "../../components/reference-sections";
import { RecruitmentWorkflowWorkspace } from "../../components/reference-workspaces";
import { AtsConsole } from "../../components/ats-console";
import { CalendarClock, FileUp, Plus, UserSearch } from "lucide-react";

export default function AtsPage() {
  return (
    <AppShell title="Recruitment ATS" subtitle="Job posting, candidates, interviews, walk-ins, campus drives, offers and joining workflow.">
      <ReferenceModuleHeader
        eyebrow="ATS"
        title="Recruitment ATS"
        summary="Jobs, candidates, resumes, interviews, walk-ins, campus drives, offer letters and joining workflow."
        tabs={["Jobs", "Candidates", "Interviews", "Offers", "Joining"]}
        activeTab="Candidates"
        actions={[
          { label: "Post Job", icon: <Plus className="h-4 w-4" />, tone: "primary" },
          { label: "Resume Upload", icon: <FileUp className="h-4 w-4" /> },
          { label: "Schedule", icon: <CalendarClock className="h-4 w-4" /> },
          { label: "Search", icon: <UserSearch className="h-4 w-4" /> },
        ]}
        stats={[
          { label: "Pipeline", value: "Live", note: "API source" },
          { label: "Stages", value: "6", note: "Hiring flow" },
          { label: "Offer", value: "Ready", note: "Joining linked" },
        ]}
      />
      <PlanGate moduleName="Recruitment ATS" requiredPlan="Pro">
        <ReferenceFlowStrip module="ATS" />
        <RecruitmentWorkflowWorkspace />
        <AtsActionPanel />
        <AtsConsole />
      </PlanGate>
    </AppShell>
  );
}
