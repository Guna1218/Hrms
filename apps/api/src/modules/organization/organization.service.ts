import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { response } from "../../common/crud-response";
import { PrismaService } from "../../prisma/prisma.service";
import { ManagerMappingDto } from "./dto/manager-mapping.dto";

@Injectable()
export class OrganizationService {
  constructor(private readonly prisma: PrismaService) {}

  async chart() {
    const employees = await this.prisma.employee.findMany({
      include: {
        department: true,
        designation: true,
        location: true,
        documents: true,
      },
      orderBy: { employeeCode: "asc" },
    });

    const managerNames = new Map(employees.map((employee) => [employee.id, `${employee.firstName} ${employee.lastName}`]));
    const nodes = employees.map((employee) => {
      const photoDoc = employee.documents?.find((d) => d.documentType === "Profile Photo");
      return {
        id: employee.id,
        employeeCode: employee.employeeCode,
        name: `${employee.firstName} ${employee.lastName}`,
        managerId: employee.managerId,
        managerName: employee.managerId ? managerNames.get(employee.managerId) || "Unmapped Manager" : null,
        department: employee.department?.name || "Unassigned",
        designation: employee.designation?.title || "Unassigned",
        location: employee.location?.name || "Unassigned",
        status: employee.status,
        photoUrl: photoDoc ? photoDoc.fileUrl : null,
      };
    });

    const departmentTree = Object.values(
      nodes.reduce<Record<string, { department: string; count: number; employees: typeof nodes }>>((groups, node) => {
        groups[node.department] ??= { department: node.department, count: 0, employees: [] };
        groups[node.department].count += 1;
        groups[node.department].employees.push(node);
        return groups;
      }, {}),
    ).sort((a, b) => a.department.localeCompare(b.department));

    const reportingTree = nodes.map((node) => ({
      ...node,
      reports: nodes.filter((candidate) => candidate.managerId === node.id),
    }));

    return response("organization", "chart", {
      employees: nodes,
      departmentTree,
      reportingTree,
      unmappedEmployees: nodes.filter((node) => !node.managerId),
    });
  }

  async updateManager(employeeId: string, data: ManagerMappingDto) {
    if (employeeId === data.managerId) {
      throw new BadRequestException("An employee cannot report to themselves");
    }

    const employee = await this.prisma.employee.findUnique({ where: { id: employeeId } });
    if (!employee) throw new NotFoundException("Employee not found");

    if (data.managerId) {
      const manager = await this.prisma.employee.findUnique({ where: { id: data.managerId } });
      if (!manager) throw new NotFoundException("Manager not found");
    }

    const updated = await this.prisma.employee.update({
      where: { id: employeeId },
      data: { managerId: data.managerId || null },
      include: {
        department: true,
        designation: true,
        location: true,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        module: "organization",
        action: "manager.update",
        entityType: "employee",
        entityId: employeeId,
        oldValueJson: employee,
        newValueJson: updated,
      },
    });

    return response("organization", "manager.update", updated);
  }
}
