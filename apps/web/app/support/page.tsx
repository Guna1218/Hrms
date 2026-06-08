import { AppShell } from "../../components/app-shell";
import { SupportConsole } from "../../components/support-console";

export default function SupportPage() {
  return (
    <AppShell title="Support" subtitle="Support desk for HRMS operations, payroll, setup and technical assistance.">
      <SupportConsole />
    </AppShell>
  );
}

