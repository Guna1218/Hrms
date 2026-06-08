import { Injectable } from "@nestjs/common";
import { response } from "../../common/crud-response";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async metrics(panel: string) {
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const [employeeCount, presentToday, pendingLeaves, payroll, pendingCompliance, pendingApprovals] =
      await Promise.all([
        this.prisma.employee.count({ where: { status: "ACTIVE" } }),
        this.prisma.attendanceLog.count({
          where: { date: { gte: startOfDay, lte: endOfDay }, status: { in: ["PRESENT", "LATE"] } },
        }),
        this.prisma.leaveRequest.count({ where: { status: "PENDING" } }),
        this.prisma.payslip.aggregate({ _sum: { netPay: true } }),
        this.prisma.auditLog.count({ where: { module: "compliance", action: "pending" } }),
        this.prisma.leaveRequest.count({ where: { status: "PENDING" } }),
      ]);

    return response("dashboard", panel, {
      employeeCount,
      presentToday,
      pendingLeaves,
      payrollNetPay: Number(payroll._sum.netPay || 0),
      pendingCompliance,
      pendingApprovals,
    });
  }
}
