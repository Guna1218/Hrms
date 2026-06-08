import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ApprovalStatus } from "@prisma/client";
import { response } from "../../common/crud-response";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateLeaveRequestDto } from "./dto/create-leave-request.dto";
import { DecideLeaveRequestDto } from "./dto/decide-leave-request.dto";

@Injectable()
export class LeaveService {
  constructor(private readonly prisma: PrismaService) {}

  async types() {
    // Ensure all 5 standard leave types exist
    const defaultTypes = [
      { name: "Event Leave", code: "EL", annualQuota: 5 },
      { name: "ON Duty Leave", code: "ODL", annualQuota: 30 },
      { name: "Paternity Leave", code: "PL", annualQuota: 7 },
      { name: "Sick Leave", code: "SL", annualQuota: 12 },
      { name: "Casual Leave", code: "CL", annualQuota: 12 },
    ];
    for (const dt of defaultTypes) {
      await this.prisma.leaveType.upsert({
        where: { companyId_code: { companyId: "company_skylinx", code: dt.code } },
        update: {},
        create: { companyId: "company_skylinx", name: dt.name, code: dt.code, annualQuota: dt.annualQuota },
      });
    }

    const leaveTypes = await this.prisma.leaveType.findMany({
      orderBy: { name: "asc" },
    });

    const rules = await this.prisma.clientRule.findMany({
      where: { companyId: "company_skylinx", category: "leave_type_settings" },
    });
    const rulesMap = new Map(rules.map((r) => [r.key, r.valueJson]));

    const merged = leaveTypes.map((type) => {
      const extra = (rulesMap.get(type.id) as any) || {};
      return {
        ...type,
        description: extra.description || "This is a default description for the Leave Type. You can customise this.",
        weekendsBetweenLeave: extra.weekendsBetweenLeave || "Not Considered",
        holidaysBetweenLeave: extra.holidaysBetweenLeave || "Not Considered",
        creditableOnAccrual: extra.creditableOnAccrual ?? true,
        creditableOnPresentDay: extra.creditableOnPresentDay ?? false,
        accrualFrequency: extra.accrualFrequency || "Monthly",
        accrualPeriod: extra.accrualPeriod || "Start",
        allowedUnderProbation: extra.allowedUnderProbation ?? false,
        allowedUnderNoticePeriod: extra.allowedUnderNoticePeriod ?? false,
        leaveEncashEnabled: extra.leaveEncashEnabled ?? false,
        maxLeavesPerMonth: extra.maxLeavesPerMonth !== undefined ? Number(extra.maxLeavesPerMonth) : 31,
        maxContinuousLeaves: extra.maxContinuousLeaves !== undefined ? Number(extra.maxContinuousLeaves) : 31,
        negativeLeavesAllowed: extra.negativeLeavesAllowed ?? false,
        futureDatedLeavesAllowed: extra.futureDatedLeavesAllowed ?? false,
        backdatedLeavesAllowed: extra.backdatedLeavesAllowed ?? true,
        backdatedLeavesDaysLimit: extra.backdatedLeavesDaysLimit !== undefined ? Number(extra.backdatedLeavesDaysLimit) : 90,
        applyNextYearTillMonth: extra.applyNextYearTillMonth || "February",
      };
    });

    return response("leave", "types", merged);
  }

  async updateType(id: string, data: any) {
    const leaveType = await this.prisma.leaveType.findUnique({ where: { id } });
    if (!leaveType) throw new NotFoundException("Leave type not found");

    const updatedModel = await this.prisma.leaveType.update({
      where: { id },
      data: {
        name: data.name !== undefined ? data.name : undefined,
        code: data.code !== undefined ? data.code : undefined,
        annualQuota: data.annualQuota !== undefined ? Number(data.annualQuota) : undefined,
        carryForwardAllowed: data.carryForwardAllowed !== undefined ? Boolean(data.carryForwardAllowed) : undefined,
        sandwichRuleEnabled: data.sandwichRuleEnabled !== undefined ? Boolean(data.sandwichRuleEnabled) : undefined,
      },
    });

    const extraSettings = {
      description: data.description,
      weekendsBetweenLeave: data.weekendsBetweenLeave,
      holidaysBetweenLeave: data.holidaysBetweenLeave,
      creditableOnAccrual: data.creditableOnAccrual,
      creditableOnPresentDay: data.creditableOnPresentDay,
      accrualFrequency: data.accrualFrequency,
      accrualPeriod: data.accrualPeriod,
      allowedUnderProbation: data.allowedUnderProbation,
      allowedUnderNoticePeriod: data.allowedUnderNoticePeriod,
      leaveEncashEnabled: data.leaveEncashEnabled,
      maxLeavesPerMonth: data.maxLeavesPerMonth,
      maxContinuousLeaves: data.maxContinuousLeaves,
      negativeLeavesAllowed: data.negativeLeavesAllowed,
      futureDatedLeavesAllowed: data.futureDatedLeavesAllowed,
      backdatedLeavesAllowed: data.backdatedLeavesAllowed,
      backdatedLeavesDaysLimit: data.backdatedLeavesDaysLimit,
      applyNextYearTillMonth: data.applyNextYearTillMonth,
    };

    const filteredExtra: any = {};
    for (const [k, v] of Object.entries(extraSettings)) {
      if (v !== undefined) filteredExtra[k] = v;
    }

    if (Object.keys(filteredExtra).length > 0) {
      const existingRule = await this.prisma.clientRule.findUnique({
        where: {
          companyId_category_key: {
            companyId: "company_skylinx",
            category: "leave_type_settings",
            key: id,
          },
        },
      });
      const oldValue = existingRule ? (existingRule.valueJson as any) : {};
      const newValue = { ...oldValue, ...filteredExtra };

      await this.prisma.clientRule.upsert({
        where: {
          companyId_category_key: {
            companyId: "company_skylinx",
            category: "leave_type_settings",
            key: id,
          },
        },
        update: { valueJson: newValue },
        create: {
          companyId: "company_skylinx",
          category: "leave_type_settings",
          key: id,
          valueJson: newValue,
        },
      });
    }

    return response("leave", "type.update", updatedModel);
  }

  async createType(data: any) {
    const code = data.code ? data.code.toUpperCase() : `CUST_${Date.now().toString().slice(-4)}`;
    
    const existing = await this.prisma.leaveType.findFirst({
      where: { companyId: "company_skylinx", code },
    });
    if (existing) throw new BadRequestException(`Leave type with code ${code} already exists`);

    const newType = await this.prisma.leaveType.create({
      data: {
        companyId: "company_skylinx",
        name: data.name || "Custom Leave",
        code,
        annualQuota: data.annualQuota !== undefined ? Number(data.annualQuota) : 30,
        carryForwardAllowed: data.carryForwardAllowed !== undefined ? Boolean(data.carryForwardAllowed) : false,
        sandwichRuleEnabled: data.sandwichRuleEnabled !== undefined ? Boolean(data.sandwichRuleEnabled) : false,
        status: data.status || "ACTIVE",
      },
    });

    const extraSettings = {
      description: data.description || "Custom leave type configuration.",
      weekendsBetweenLeave: data.weekendsBetweenLeave || "Not Considered",
      holidaysBetweenLeave: data.holidaysBetweenLeave || "Not Considered",
      creditableOnAccrual: data.creditableOnAccrual !== undefined ? Boolean(data.creditableOnAccrual) : true,
      creditableOnPresentDay: data.creditableOnPresentDay !== undefined ? Boolean(data.creditableOnPresentDay) : false,
      accrualFrequency: data.accrualFrequency || "Monthly",
      accrualPeriod: data.accrualPeriod || "Start",
      allowedUnderProbation: data.allowedUnderProbation !== undefined ? Boolean(data.allowedUnderProbation) : false,
      allowedUnderNoticePeriod: data.allowedUnderNoticePeriod !== undefined ? Boolean(data.allowedUnderNoticePeriod) : false,
      leaveEncashEnabled: data.leaveEncashEnabled !== undefined ? Boolean(data.leaveEncashEnabled) : false,
      maxLeavesPerMonth: data.maxLeavesPerMonth !== undefined ? Number(data.maxLeavesPerMonth) : 31,
      maxContinuousLeaves: data.maxContinuousLeaves !== undefined ? Number(data.maxContinuousLeaves) : 31,
      negativeLeavesAllowed: data.negativeLeavesAllowed !== undefined ? Boolean(data.negativeLeavesAllowed) : false,
      futureDatedLeavesAllowed: data.futureDatedLeavesAllowed !== undefined ? Boolean(data.futureDatedLeavesAllowed) : false,
      backdatedLeavesAllowed: data.backdatedLeavesAllowed !== undefined ? Boolean(data.backdatedLeavesAllowed) : true,
      backdatedLeavesDaysLimit: data.backdatedLeavesDaysLimit !== undefined ? Number(data.backdatedLeavesDaysLimit) : 90,
      applyNextYearTillMonth: data.applyNextYearTillMonth || "February",
    };

    await this.prisma.clientRule.create({
      data: {
        companyId: "company_skylinx",
        category: "leave_type_settings",
        key: newType.id,
        valueJson: extraSettings,
      },
    });

    return response("leave", "type.create", newType);
  }

  async getAssignments() {
    const employees = await this.prisma.employee.findMany({
      where: { status: "ACTIVE" },
      include: {
        leaveBalances: {
          where: { year: 2026 },
          include: {
            leaveType: true,
          },
        },
      },
      orderBy: { firstName: "asc" },
    });

    const empMap = new Map(employees.map(emp => [emp.id, `${emp.firstName} ${emp.lastName}`]));

    const rows = employees.map((emp) => ({
      id: emp.id,
      employeeCode: emp.employeeCode,
      name: `${emp.firstName} ${emp.lastName}`,
      managerName: emp.managerId ? (empMap.get(emp.managerId) || "-") : "-",
      employmentType: emp.employmentType,
      rulesApplied: emp.leaveBalances.map((b) => ({
        leaveTypeId: b.leaveTypeId,
        name: b.leaveType.name,
        code: b.leaveType.code,
      })),
    }));

    return response("leave", "assignments", rows);
  }

  async assignRules(data: { employeeIds: string[]; leaveTypeIds: string[]; effectiveDate?: string }) {
    const { employeeIds, leaveTypeIds } = data;
    if (!employeeIds.length || !leaveTypeIds.length) {
      throw new BadRequestException("Employee IDs and Leave Type IDs are required");
    }

    const leaveTypes = await this.prisma.leaveType.findMany({
      where: { id: { in: leaveTypeIds } },
    });

    const results = [];
    for (const empId of employeeIds) {
      for (const lt of leaveTypes) {
        const bal = await this.prisma.leaveBalance.upsert({
          where: {
            employeeId_leaveTypeId_year: {
              employeeId: empId,
              leaveTypeId: lt.id,
              year: 2026,
            },
          },
          update: {},
          create: {
            employeeId: empId,
            leaveTypeId: lt.id,
            year: 2026,
            openingBalance: lt.annualQuota,
            accrued: lt.annualQuota,
            used: 0,
            carriedForward: 0,
            available: lt.annualQuota,
          },
        });
        results.push(bal);
      }
    }

    return response("leave", "assignments.create", results);
  }

  async unassignRules(data: { employeeIds: string[]; leaveTypeIds: string[] }) {
    const { employeeIds, leaveTypeIds } = data;
    
    await this.prisma.leaveBalance.deleteMany({
      where: {
        employeeId: { in: employeeIds },
        leaveTypeId: { in: leaveTypeIds },
        year: 2026,
      },
    });

    return response("leave", "assignments.delete", { success: true });
  }



  async balances() {
    const balances = await this.prisma.leaveBalance.findMany({
      include: {
        employee: true,
        leaveType: true,
      },
      orderBy: [{ year: "desc" }],
    });
    return response("leave", "balances", balances);
  }

  async requests() {
    const requests = await this.prisma.leaveRequest.findMany({
      include: {
        employee: true,
        leaveType: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return response("leave", "requests", requests);
  }

  async request(data: CreateLeaveRequestDto) {
    const leaveType = await this.prisma.leaveType.findUnique({
      where: { id: data.leaveTypeId },
    });
    if (!leaveType) throw new NotFoundException("Leave type not found");

    const year = new Date(data.fromDate).getFullYear();
    const balance = await this.prisma.leaveBalance.findUnique({
      where: {
        employeeId_leaveTypeId_year: {
          employeeId: data.employeeId,
          leaveTypeId: data.leaveTypeId,
          year,
        },
      },
    });

    if (!balance) throw new BadRequestException("Leave balance is not configured for this employee");
    if (Number(balance.available) < data.days) {
      throw new BadRequestException("Insufficient leave balance");
    }

    const leaveRequest = await this.prisma.leaveRequest.create({
      data: {
        employeeId: data.employeeId,
        leaveTypeId: data.leaveTypeId,
        fromDate: new Date(data.fromDate),
        toDate: new Date(data.toDate),
        days: data.days,
        reason: data.reason,
        status: ApprovalStatus.PENDING,
      },
      include: {
        employee: true,
        leaveType: true,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        module: "leave",
        action: "request.create",
        entityType: "leave_request",
        entityId: leaveRequest.id,
        newValueJson: leaveRequest,
      },
    });

    return response("leave", "request.create", leaveRequest);
  }

  async approve(id: string, data: DecideLeaveRequestDto) {
    const leaveRequest = await this.prisma.leaveRequest.findUnique({
      where: { id },
    });
    if (!leaveRequest) throw new NotFoundException("Leave request not found");
    if (leaveRequest.status !== ApprovalStatus.PENDING) {
      throw new BadRequestException("Only pending leave requests can be approved");
    }

    const year = leaveRequest.fromDate.getFullYear();
    const result = await this.prisma.$transaction(async (tx) => {
      const balance = await tx.leaveBalance.findUnique({
        where: {
          employeeId_leaveTypeId_year: {
            employeeId: leaveRequest.employeeId,
            leaveTypeId: leaveRequest.leaveTypeId,
            year,
          },
        },
      });
      if (!balance) throw new BadRequestException("Leave balance is not configured for this employee");
      if (Number(balance.available) < Number(leaveRequest.days)) {
        throw new BadRequestException("Insufficient leave balance");
      }

      const updatedBalance = await tx.leaveBalance.update({
        where: { id: balance.id },
        data: {
          used: { increment: leaveRequest.days },
          available: { decrement: leaveRequest.days },
        },
      });

      const approved = await tx.leaveRequest.update({
        where: { id },
        data: {
          status: ApprovalStatus.APPROVED,
          managerId: data.decidedByUserId,
          decidedAt: new Date(),
        },
        include: {
          employee: true,
          leaveType: true,
        },
      });

      await tx.auditLog.create({
        data: {
          actorUserId: data.decidedByUserId,
          module: "leave",
          action: "request.approve",
          entityType: "leave_request",
          entityId: id,
          oldValueJson: leaveRequest,
          newValueJson: { leaveRequest: approved, balance: updatedBalance, note: data.note },
        },
      });

      return approved;
    });

    return response("leave", "request.approve", result);
  }

  async reject(id: string, data: DecideLeaveRequestDto) {
    const leaveRequest = await this.prisma.leaveRequest.findUnique({
      where: { id },
    });
    if (!leaveRequest) throw new NotFoundException("Leave request not found");
    if (leaveRequest.status !== ApprovalStatus.PENDING) {
      throw new BadRequestException("Only pending leave requests can be rejected");
    }

    const rejected = await this.prisma.leaveRequest.update({
      where: { id },
      data: {
        status: ApprovalStatus.REJECTED,
        managerId: data.decidedByUserId,
        decidedAt: new Date(),
      },
      include: {
        employee: true,
        leaveType: true,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        actorUserId: data.decidedByUserId,
        module: "leave",
        action: "request.reject",
        entityType: "leave_request",
        entityId: id,
        oldValueJson: leaveRequest,
        newValueJson: { leaveRequest: rejected, note: data.note },
      },
    });

    return response("leave", "request.reject", rejected);
  }
}
