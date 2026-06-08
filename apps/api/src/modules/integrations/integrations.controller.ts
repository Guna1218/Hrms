import { Controller, Get, Param, Post } from "@nestjs/common";
import { CurrentUser } from "../../common/auth/current-user.decorator";
import { RequirePermissions } from "../../common/auth/permissions.decorator";
import { AuthenticatedUser } from "../../common/auth/auth.types";
import { IntegrationsService } from "./integrations.service";

@Controller("integrations")
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Get()
  @RequirePermissions("integrations.read")
  summary() {
    return this.integrationsService.summary();
  }

  @Post("test/:key")
  @RequirePermissions("integrations.configure")
  test(@CurrentUser() user: AuthenticatedUser, @Param("key") key: string) {
    return this.integrationsService.test(user, key);
  }
}
