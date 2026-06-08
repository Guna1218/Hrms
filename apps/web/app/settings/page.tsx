import { AppShell } from "../../components/app-shell";
import { SettingsTabsContainer } from "../../components/settings-tabs-container";

export default function SettingsPage() {
  return (
    <AppShell title="Settings & Admin Controls" subtitle="Configure company profile, branding, enabled modules, import/export and license controls.">
      <SettingsTabsContainer />
    </AppShell>
  );
}


