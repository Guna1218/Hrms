import { Injectable, NotFoundException } from "@nestjs/common";
import { ApprovalStatus } from "@prisma/client";
import { response } from "../../common/crud-response";
import { AuthenticatedUser } from "../../common/auth/auth.types";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class ApprovalsService {
  constructor(private readonly prisma: PrismaService) {}

  async summary() {
    const [leaveRequests, attendanceRegularizations, expenses, insuranceClaims, payrollRuns, applications] = await Promise.all([
      this.prisma.leaveRequest.findMany({ include: { employee: true, leaveType: true }, orderBy: { createdAt: "desc" } }),
      this.prisma.attendanceRegularization.findMany({ include: { employee: true }, orderBy: { createdAt: "desc" } }),
      this.prisma.expense.findMany({ include: { employee: true }, orderBy: { claimDate: "desc" } }),
      this.prisma.insuranceClaim.findMany({ include: { employee: true }, orderBy: { claimDate: "desc" } }),
      this.prisma.payrollRun.findMany({ orderBy: [{ year: "desc" }, { month: "desc" }] }),
      this.prisma.jobApplication.findMany({ include: { candidate: true, jobPosting: true }, orderBy: { createdAt: "desc" } }),
    ]);

    const items = [
      ...leaveRequests.map((item) => ({
        id: item.id,
        type: "Leave",
        module: "leave",
        requester: `${item.employee.firstName} ${item.employee.lastName}`,
        title: item.leaveType.name,
        amount: Number(item.days),
        status: item.status,
        createdAt: item.createdAt,
      })),
      ...attendanceRegularizations.map((item) => ({
        id: item.id,
        type: "Attendance",
        module: "attendance",
        requester: `${item.employee.firstName} ${item.employee.lastName}`,
        title: item.reason,
        amount: 0,
        status: item.status,
        createdAt: item.createdAt,
      })),
      ...expenses.map((item) => ({
        id: item.id,
        type: "Expense",
        module: "expenses",
        requester: `${item.employee.firstName} ${item.employee.lastName}`,
        title: item.category,
        amount: Number(item.amount),
        status: item.status,
        createdAt: item.claimDate,
      })),
      ...insuranceClaims.map((item) => ({
        id: item.id,
        type: "Insurance",
        module: "insurance",
        requester: `${item.employee.firstName} ${item.employee.lastName}`,
        title: item.claimType,
        amount: Number(item.claimAmount),
        status: item.status,
        createdAt: item.claimDate,
      })),
      ...payrollRuns.map((item) => ({
        id: item.id,
        type: "Payroll",
        module: "payroll",
        requester: "Payroll Team",
        title: `${item.month}/${item.year}`,
        amount: 0,
        status: item.status,
        createdAt: item.processedAt || new Date(item.year, item.month - 1, 1),
      })),
      ...applications.map((item) => ({
        id: item.id,
        type: "ATS",
        module: "ats",
        requester: item.candidate.fullName,
        title: item.jobPosting.title,
        amount: 0,
        status: item.status,
        createdAt: item.createdAt,
      })),
    ];

    const pending = items.filter((item) => ["PENDING", "DRAFT", "ACTIVE"].includes(String(item.status))).length;
    const approved = items.filter((item) => ["APPROVED", "PAID", "OFFERED"].includes(String(item.status))).length;

    return response("approvals", "summary", {
      total: items.length,
      pending,
      approved,
      rejected: items.filter((item) => item.status === "REJECTED").length,
      modules: [
        { module: "leave", count: leaveRequests.length },
        { module: "attendance", count: attendanceRegularizations.length },
        { module: "expenses", count: expenses.length },
        { module: "insurance", count: insuranceClaims.length },
        { module: "payroll", count: payrollRuns.length },
        { module: "ats", count: applications.length },
      ],
      items: items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    });
  }

  async decide(user: AuthenticatedUser, module: string, id: string, decision: "approve" | "reject") {
    const status = decision === "approve" ? ApprovalStatus.APPROVED : ApprovalStatus.REJECTED;
    let result: unknown;

    if (module === "leave") {
      result = await this.prisma.leaveRequest.update({ where: { id }, data: { status, decidedAt: new Date() } });
    } else if (module === "attendance") {
      result = await this.prisma.attendanceRegularization.update({ where: { id }, data: { status, decidedAt: new Date(), decidedBy: user.sub } });
    } else if (module === "expenses") {
      result = await this.prisma.expense.update({ where: { id }, data: { status, hrApprovedBy: decision === "approve" ? user.sub : undefined } });
    } else if (module === "insurance") {
      result = await this.prisma.insuranceClaim.update({ where: { id }, data: { status, decidedBy: user.sub, decidedAt: new Date() } });
    } else if (module === "payroll") {
      result = await this.prisma.payrollRun.update({ where: { id }, data: { status, processedBy: user.sub, processedAt: new Date() } });
    } else if (module === "ats") {
      result = await this.prisma.jobApplication.update({ where: { id }, data: { status: decision === "approve" ? "APPROVED" : "REJECTED" } });
    } else {
      throw new NotFoundException("Approval module not found");
    }

    await this.prisma.auditLog.create({
      data: {
        actorUserId: user.sub,
        module: "approvals",
        action: `approval.${decision}`,
        entityType: module,
        entityId: id,
        newValueJson: JSON.parse(JSON.stringify(result)),
      },
    });

    return response("approvals", decision, result);
  }
}
