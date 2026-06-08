import { AppShell } from "../../components/app-shell";
import { SaasPageContent } from "../../components/saas-page-content";

export default function SaasPage() {
  return (
    <AppShell title="SaaS Billing" subtitle="Multi-company, subscription plan, license and module entitlement controls.">
      <SaasPageContent />
    </AppShell>
  );
}
