import { AppShell } from "../../components/app-shell";
import { ReportsConsole } from "../../components/reports-console";

export default function ReportsPage() {
  return (
    <AppShell title="Reports" subtitle="Export HRMS data to Excel and PDF for management, finance and compliance reviews.">
      <ReportsConsole />
    </AppShell>
  );
}
