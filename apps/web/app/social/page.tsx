import { AppShell } from "../../components/app-shell";
import { SkyNexusConsole } from "../../components/skynexus-console";

export default function SocialPage() {
  return (
    <AppShell title="Internal Social Feed" subtitle="Share announcements, employee posts, recognition updates, likes, comments and birthday wishes.">
      <SkyNexusConsole />
    </AppShell>
  );
}
