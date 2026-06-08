import { AppShell } from "../../components/app-shell";
import { HolidayConsole } from "../../components/holiday-console";

export default function HolidaysPage() {
  return (
    <AppShell title="Holiday Calendar" subtitle="Manage mandatory, optional and regional holidays for leave and attendance planning.">
      <HolidayConsole />
    </AppShell>
  );
}
