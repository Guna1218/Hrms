import { AppShell } from "../../components/app-shell";
import { InsuranceConsole } from "../../components/insurance-console";

export default function InsurancePage() {
  return (
    <AppShell title="Insurance Management" subtitle="Manage employee policies, dependents, policy coverage and insurance claim approvals.">
      <InsuranceConsole />
    </AppShell>
  );
}
