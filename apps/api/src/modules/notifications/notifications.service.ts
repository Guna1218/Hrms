import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { NotificationChannel } from "@prisma/client";
import { response } from "../../common/crud-response";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateNotificationDto } from "./dto/notification.dto";

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    const notifications = await this.prisma.notification.findMany({
      include: {
        user: {
          include: {
            employee: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return response("notifications", "list", notifications);
  }

  async recipients() {
    const users = await this.prisma.user.findMany({
      where: { status: "ACTIVE" },
      include: { employee: true },
      orderBy: { email: "asc" },
    });
    return response("notifications", "recipients", users);
  }

  async create(data: CreateNotificationDto) {
    const users = await this.resolveRecipients(data);
    if (!users.length) throw new BadRequestException("No notification recipients found");

    const notifications = await this.prisma.$transaction(
      users.map((user) =>
        this.prisma.notification.create({
          data: {
            userId: user.id,
            channel: data.channel as NotificationChannel,
            title: data.title,
            body: data.body,
            status: "PENDING",
          },
          include: {
            user: {
              include: { employee: true },
            },
          },
        }),
      ),
    );

    await this.prisma.auditLog.create({
      data: {
        module: "notifications",
        action: data.audience ? "broadcast.create" : "notification.create",
        entityType: "notification",
        entityId: notifications[0]?.id,
        newValueJson: { count: notifications.length, channel: data.channel, title: data.title, audience: data.audience, userId: data.userId },
      },
    });

    return response("notifications", "create", notifications);
  }

  async markSent(id: string) {
    const current = await this.prisma.notification.findUnique({ where: { id } });
    if (!current) throw new NotFoundException("Notification not found");

    const notification = await this.prisma.notification.update({
      where: { id },
      data: {
        status: "SENT",
        sentAt: new Date(),
      },
      include: {
        user: {
          include: { employee: true },
        },
      },
    });

    await this.prisma.auditLog.create({
      data: {
        module: "notifications",
        action: "notification.sent",
        entityType: "notification",
        entityId: id,
        oldValueJson: current,
        newValueJson: notification,
      },
    });

    return response("notifications", "sent", notification);
  }

  private async resolveRecipients(data: CreateNotificationDto) {
    if (data.userId) {
      const user = await this.prisma.user.findUnique({ where: { id: data.userId } });
      if (!user) throw new NotFoundException("Notification recipient not found");
      return [user];
    }

    if (data.audience === "HR") {
      return this.prisma.user.findMany({
        where: {
          status: "ACTIVE",
          roles: {
            some: {
              role: { name: { in: ["HR_ADMIN", "SUPER_ADMIN"] } },
            },
          },
        },
      });
    }

    return this.prisma.user.findMany({ where: { status: "ACTIVE" } });
  }
}
