import { AppShell } from "../../components/app-shell";
import { ExpensesConsole } from "../../components/expenses-console";

export default function ExpensesPage() {
  return (
    <AppShell title="Expense Management" subtitle="Submit employee claims, review receipts, approve expenses and track reimbursements.">
      <ExpensesConsole />
    </AppShell>
  );
}
