import { Injectable } from "@nestjs/common";
import { response } from "../../common/crud-response";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class ComplianceService {
  constructor(private readonly prisma: PrismaService) {}

  async summary() {
    const [salaryStructures, payrollRuns, employees] = await Promise.all([
      this.prisma.salaryStructure.findMany({
        include: { employee: { include: { department: true } } },
        orderBy: { effectiveFrom: "desc" },
      }),
      this.prisma.payrollRun.findMany({ orderBy: [{ year: "desc" }, { month: "desc" }] }),
      this.prisma.employee.findMany({ where: { status: "ACTIVE" } }),
    ]);

    const totals = salaryStructures.reduce(
      (sum, salary) => ({
        pf: sum.pf + Number(salary.employeePf),
        esi: sum.esi + Number(salary.esi),
        professionalTax: sum.professionalTax + Number(salary.professionalTax),
        tds: sum.tds + Number(salary.tds),
      }),
      { pf: 0, esi: 0, professionalTax: 0, tds: 0 },
    );

    const rows = salaryStructures.map((salary) => ({
      employeeId: salary.employeeId,
      employee: `${salary.employee.firstName} ${salary.employee.lastName}`,
      department: salary.employee.department?.name || "-",
      annualCtc: salary.annualCtc,
      pf: salary.employeePf,
      esi: salary.esi,
      professionalTax: salary.professionalTax,
      tds: salary.tds,
      form16Status: Number(salary.tds) > 0 ? "READY" : "NOT_REQUIRED",
      effectiveFrom: salary.effectiveFrom,
    }));

    return response("compliance", "summary", {
      activeEmployees: employees.length,
      configuredEmployees: salaryStructures.length,
      payrollRuns: payrollRuns.length,
      totals,
      checks: [
        { name: "PF", status: totals.pf > 0 ? "READY" : "REVIEW", amount: totals.pf },
        { name: "ESI", status: totals.esi > 0 ? "READY" : "REVIEW", amount: totals.esi },
        { name: "Professional Tax", status: totals.professionalTax > 0 ? "READY" : "REVIEW", amount: totals.professionalTax },
        { name: "TDS", status: totals.tds > 0 ? "READY" : "REVIEW", amount: totals.tds },
        { name: "Form 16", status: rows.some((row) => row.form16Status === "READY") ? "READY" : "REVIEW", amount: totals.tds },
      ],
      rows,
    });
  }

  async export(type: string) {
    const audit = await this.prisma.auditLog.create({
      data: {
        module: "compliance",
        action: "export.queue",
        entityType: "compliance_report",
        entityId: `compliance_${type}_${Date.now()}`,
        newValueJson: { type, status: "QUEUED", queuedAt: new Date().toISOString() },
      },
    });
    return response("compliance", "export", { type, status: "queued", auditId: audit.id });
  }
}
