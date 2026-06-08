import { AppShell } from "../../components/app-shell";
import { PlanGate } from "../../components/plan-gate";
import { RewardsActionPanel } from "../../components/action-panels";
import { RewardsDashboard } from "../../components/rewards-dashboard";
import { ReferenceModuleHeader } from "../../components/reference-module";
import { ReferenceFlowStrip } from "../../components/reference-sections";
import { RewardsMarketplaceWorkspace } from "../../components/reference-workspaces";
import { Gift, Megaphone, Plus, Trophy } from "lucide-react";

export default function RewardsPage() {
  return (
    <AppShell title="Rewards & Benefits" subtitle="Manage vouchers, reward points, employee recognition and benefits marketplace items.">
      <ReferenceModuleHeader
        eyebrow="Rewards"
        title="Rewards Marketplace"
        summary="Create vouchers, benefits, recognition posts and reward point activity with a marketplace layout inspired by the reference."
        tabs={["Marketplace", "Vouchers", "Benefits", "Recognition"]}
        activeTab="Marketplace"
        actions={[
          { label: "Add Reward", icon: <Plus className="h-4 w-4" />, tone: "primary" },
          { label: "Voucher", icon: <Gift className="h-4 w-4" /> },
          { label: "Recognize", icon: <Trophy className="h-4 w-4" /> },
          { label: "Announce", icon: <Megaphone className="h-4 w-4" /> },
        ]}
        stats={[
          { label: "Catalog", value: "Live", note: "API rewards" },
          { label: "Points", value: "Ledger", note: "Audit ready" },
          { label: "Rollout", value: "Company", note: "Employee view" },
        ]}
      />
      <PlanGate moduleName="Rewards & Benefits" requiredPlan="Pro">
        <ReferenceFlowStrip module="Rewards" />
        <RewardsMarketplaceWorkspace />
        <RewardsActionPanel />
        <RewardsDashboard />
      </PlanGate>
    </AppShell>
  );
}
