import { AppShell } from "../../components/app-shell";
import { SaasAdminPageContent } from "../../components/saas-admin-page-content";

export default function SaasAdminPage() {
  return (
    <AppShell title="SaaS Control Room" subtitle="System Owner Dashboard for client management, telemetry, and platform diagnostics.">
      <SaasAdminPageContent />
    </AppShell>
  );
}
