import { AppShell } from "../../components/app-shell";
import { ApprovalsConsole } from "../../components/approvals-console";

export default function ApprovalsPage() {
  return (
    <AppShell title="Approvals" subtitle="Unified approval queue for HR, manager and payroll decisions.">
      <ApprovalsConsole />
    </AppShell>
  );
}

