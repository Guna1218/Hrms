import { AppShellFrame } from "./app-shell-frame";
import { nav } from "./nav-items";
import { getActivePlan } from "../lib/plan-server";

export { nav };

export async function AppShell({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) {
  const activePlan = await getActivePlan();

  return (
    <AppShellFrame activePlan={activePlan} title={title} subtitle={subtitle}>
      {children}
    </AppShellFrame>
  );
}
