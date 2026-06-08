import { AppShell } from "../../components/app-shell";
import { LeaveConsole } from "../../components/leave-console";

export default function LeavePage() {
  return (
    <AppShell title="Leave Management" subtitle="Apply leave, approve or reject requests, and track balances with rules.">
      <LeaveConsole />
    </AppShell>
  );
}

