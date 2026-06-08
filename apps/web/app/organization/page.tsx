import { AppShell } from "../../components/app-shell";
import { OrganizationConsole } from "../../components/organization-console";

export default function OrganizationPage() {
  return (
    <AppShell title="Organization Chart" subtitle="Map managers, view reporting hierarchy, and track department structure.">
      <OrganizationConsole />
    </AppShell>
  );
}
