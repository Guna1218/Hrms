import { Injectable } from "@nestjs/common";
import { response } from "../../common/crud-response";
import { AuthenticatedUser } from "../../common/auth/auth.types";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class AssetsService {
  constructor(private readonly prisma: PrismaService) {}

  async summary() {
    const [employees, auditLogs] = await Promise.all([
      this.prisma.employee.findMany({
        where: { status: "ACTIVE" },
        include: { department: true, designation: true },
        orderBy: { employeeCode: "asc" },
      }),
      this.prisma.auditLog.findMany({
        where: { module: "assets" },
        orderBy: { createdAt: "desc" },
        take: 30,
      }),
    ]);

    const assetRows = employees.flatMap((employee, index) => {
      const owner = `${employee.firstName} ${employee.lastName}`;
      const base = [
        {
          id: `asset_laptop_${employee.id}`,
          assetTag: `SKY-LAP-${String(index + 1).padStart(3, "0")}`,
          type: "Laptop",
          item: index % 2 ? "Dell Latitude" : "HP EliteBook",
          assignedTo: owner,
          department: employee.department?.name || "-",
          status: "ASSIGNED",
          condition: "GOOD",
        },
      ];
      if (index < 3) {
        base.push({
          id: `asset_id_${employee.id}`,
          assetTag: `SKY-ID-${employee.employeeCode}`,
          type: "ID Card",
          item: "Employee ID Card",
          assignedTo: owner,
          department: employee.department?.name || "-",
          status: "ASSIGNED",
          condition: "GOOD",
        });
      }
      return base;
    });

    const returned = auditLogs.filter((log) => log.action === "asset.return").length;
    const assigned = assetRows.filter((asset) => asset.status === "ASSIGNED").length;

    return response("assets", "summary", {
      total: assetRows.length,
      assigned,
      available: 2,
      returned,
      handoverPending: employees.length - Math.min(employees.length, returned),
      categories: [
        { type: "Laptop", count: assetRows.filter((asset) => asset.type === "Laptop").length },
        { type: "ID Card", count: assetRows.filter((asset) => asset.type === "ID Card").length },
        { type: "Phone", count: 0 },
        { type: "Accessories", count: 2 },
      ],
      rows: assetRows,
      logs: auditLogs.map((log) => ({
        id: log.id,
        action: log.action,
        assetTag: log.entityId || "-",
        status: (log.newValueJson as { status?: string } | null)?.status || "COMPLETED",
        createdAt: log.createdAt,
      })),
    });
  }

  async assign(user: AuthenticatedUser, assetTag: string) {
    return this.audit(user, "asset.assign", assetTag, "ASSIGNED");
  }

  async returnAsset(user: AuthenticatedUser, assetTag: string) {
    return this.audit(user, "asset.return", assetTag, "RETURNED");
  }

  private async audit(user: AuthenticatedUser, action: string, assetTag: string, status: string) {
    const log = await this.prisma.auditLog.create({
      data: {
        actorUserId: user.sub,
        module: "assets",
        action,
        entityType: "company_asset",
        entityId: assetTag,
        newValueJson: {
          status,
          actionedAt: new Date().toISOString(),
        },
      },
    });
    return response("assets", action, log);
  }
}
