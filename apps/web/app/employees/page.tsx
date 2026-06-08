import { AppShell } from "../../components/app-shell";
import { EmployeesConsole } from "../../components/employees-console";

export default function EmployeesPage() {
  return (
    <AppShell title="Employee Directory" subtitle="Manage employee profiles, documents, departments, locations and verification.">
      <EmployeesConsole />
    </AppShell>
  );
}
