import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { RequirePermissions } from "../../common/auth/permissions.decorator";
import { CreateNotificationDto } from "./dto/notification.dto";
import { NotificationsService } from "./notifications.service";

@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @RequirePermissions("notifications.read")
  list() {
    return this.notificationsService.list();
  }

  @Get("recipients")
  @RequirePermissions("notifications.read")
  recipients() {
    return this.notificationsService.recipients();
  }

  @Post()
  @RequirePermissions("notifications.create")
  create(@Body() body: CreateNotificationDto) {
    return this.notificationsService.create(body);
  }

  @Patch(":id/sent")
  @RequirePermissions("notifications.update")
  markSent(@Param("id") id: string) {
    return this.notificationsService.markSent(id);
  }
}
