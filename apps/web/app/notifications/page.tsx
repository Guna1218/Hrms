import { AppShell } from "../../components/app-shell";
import { NotificationsConsole } from "../../components/notifications-console";

export default function NotificationsPage() {
  return (
    <AppShell title="Notifications & Alerts" subtitle="Inspect and receive email, push, and in-app alerts for updates in attendance, leaves, payroll, and HR announcements.">
      <NotificationsConsole />
    </AppShell>
  );
}
