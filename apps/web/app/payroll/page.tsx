import { AppShell } from "../../components/app-shell";
import { PayrollConsole } from "../../components/payroll-console";
import { PlanGate } from "../../components/plan-gate";

export default function PayrollPage() {
  return (
    <AppShell title="Payroll Management" subtitle="Salary structures, payroll runs, payslips, deductions, TDS, PF, ESI, PT and bank exports.">
      <PlanGate moduleName="Payroll Management" requiredPlan="Standard">
        <PayrollConsole />
      </PlanGate>
    </AppShell>
  );
}

