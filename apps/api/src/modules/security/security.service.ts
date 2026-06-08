import { Injectable } from "@nestjs/common";
import { response } from "../../common/crud-response";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class SecurityService {
  constructor(private readonly prisma: PrismaService) {}

  async auditLogs() {
    const logs = await this.prisma.auditLog.findMany({
      include: {
        actor: {
          include: { employee: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return response("security", "auditLogs", logs);
  }

  async notifications() {
    const notifications = await this.prisma.notification.findMany({
      include: {
        user: {
          include: { employee: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return response("security", "notifications", notifications);
  }
}
