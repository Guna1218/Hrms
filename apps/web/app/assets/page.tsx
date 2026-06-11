import { AppShell } from "../../components/app-shell";
import { AssetsConsole } from "../../components/assets-console";

export default function AssetsPage() {
  return (
    <AppShell title="Assets" subtitle="Company asset inventory, employee assignment and handover tracking.">
      <AssetsConsole />
    </AppShell>
  );
}
