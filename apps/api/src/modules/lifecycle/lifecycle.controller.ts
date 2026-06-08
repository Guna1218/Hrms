import { Controller, Get, Param, Post } from "@nestjs/common";
import { CurrentUser } from "../../common/auth/current-user.decorator";
import { RequirePermissions } from "../../common/auth/permissions.decorator";
import { AuthenticatedUser } from "../../common/auth/auth.types";
import { LifecycleService } from "./lifecycle.service";

@Controller("lifecycle")
export class LifecycleController {
  constructor(private readonly lifecycleService: LifecycleService) {}

  @Get()
  @RequirePermissions("lifecycle.read")
  summary() {
    return this.lifecycleService.summary();
  }

  @Post("onboarding/:id/start")
  @RequirePermissions("lifecycle.configure")
  startOnboarding(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return this.lifecycleService.startOnboarding(user, id);
  }

  @Post("exit/:id/clearance")
  @RequirePermissions("lifecycle.configure")
  requestExitClearance(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return this.lifecycleService.requestExitClearance(user, id);
  }
}
