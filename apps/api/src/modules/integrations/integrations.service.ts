import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { response } from "../../common/crud-response";
import { AuthenticatedUser } from "../../common/auth/auth.types";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class IntegrationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async summary() {
    const [notifications, attendanceRules, auditLogs] = await Promise.all([
      this.prisma.notification.findMany(),
      this.prisma.attendanceRule.findFirst(),
      this.prisma.auditLog.findMany({
        where: { module: "integrations" },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
    ]);

    const emailCount = notifications.filter((item) => item.channel === "EMAIL").length;
    const whatsappCount = notifications.filter((item) => item.channel === "WHATSAPP").length;
    const pushCount = notifications.filter((item) => item.channel === "PUSH").length;

    const integrations = [
      {
        key: "email",
        name: "Email Alerts",
        status: this.config.get("SMTP_HOST") ? "CONNECTED" : emailCount ? "CONFIGURED" : "PENDING",
        provider: this.config.get("SMTP_HOST") || "SMTP pending",
        records: emailCount,
      },
      {
        key: "whatsapp",
        name: "WhatsApp Alerts",
        status: this.config.get("WHATSAPP_API_URL") ? "CONNECTED" : whatsappCount ? "CONFIGURED" : "PENDING",
        provider: this.config.get("WHATSAPP_API_URL") || "WhatsApp API pending",
        records: whatsappCount,
      },
      {
        key: "push",
        name: "Push Notifications",
        status: pushCount ? "CONNECTED" : "CONFIGURED",
        provider: "Notification channel",
        records: pushCount,
      },
      {
        key: "biometric",
        name: "Biometric Attendance",
        status: attendanceRules?.biometricRequired ? "CONNECTED" : "CONFIGURED",
        provider: "Device bridge ready",
        records: 0,
      },
      {
        key: "geo",
        name: "Geo Attendance",
        status: attendanceRules?.geoRequired ? "CONNECTED" : "CONFIGURED",
        provider: "Browser location",
        records: attendanceRules?.geoRequired ? 1 : 0,
      },
      {
        key: "s3",
        name: "AWS S3 Storage",
        status: this.config.get("AWS_S3_BUCKET") ? "CONNECTED" : "PENDING",
        provider: this.config.get("AWS_S3_BUCKET") || "Bucket pending",
        records: 0,
      },
      {
        key: "bank",
        name: "Bank Export",
        status: "CONFIGURED",
        provider: "Payroll bank file export",
        records: 0,
      },
    ];

    return response("integrations", "summary", {
      connected: integrations.filter((item) => item.status === "CONNECTED").length,
      configured: integrations.filter((item) => item.status !== "PENDING").length,
      total: integrations.length,
      integrations,
      logs: auditLogs.map((log) => ({
        id: log.id,
        action: log.action,
        status: (log.newValueJson as { status?: string } | null)?.status || "COMPLETED",
        provider: (log.newValueJson as { provider?: string } | null)?.provider || log.entityId || "-",
        createdAt: log.createdAt,
      })),
    });
  }

  async test(user: AuthenticatedUser, key: string) {
    const audit = await this.prisma.auditLog.create({
      data: {
        actorUserId: user.sub,
        module: "integrations",
        action: "connection.test",
        entityType: "integration",
        entityId: key,
        newValueJson: {
          provider: key,
          status: "COMPLETED",
          testedAt: new Date().toISOString(),
        },
      },
    });
    return response("integrations", "test", audit);
  }
}
