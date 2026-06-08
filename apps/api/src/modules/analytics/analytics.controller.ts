import { Controller, Get } from "@nestjs/common";
import { RequirePermissions } from "../../common/auth/permissions.decorator";
import { AnalyticsService } from "./analytics.service";

@Controller("analytics")
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  @RequirePermissions("analytics.read")
  summary() {
    return this.analyticsService.summary();
  }
}
