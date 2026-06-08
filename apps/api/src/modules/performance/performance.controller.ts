import { Controller, Get, Post } from "@nestjs/common";
import { CurrentUser } from "../../common/auth/current-user.decorator";
import { RequirePermissions } from "../../common/auth/permissions.decorator";
import { AuthenticatedUser } from "../../common/auth/auth.types";
import { PerformanceService } from "./performance.service";

@Controller("performance")
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  @Get()
  @RequirePermissions("performance.read")
  summary() {
    return this.performanceService.summary();
  }

  @Post("cycle")
  @RequirePermissions("performance.configure")
  launchCycle(@CurrentUser() user: AuthenticatedUser) {
    return this.performanceService.launchCycle(user);
  }
}
