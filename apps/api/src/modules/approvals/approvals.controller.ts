import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CurrentUser } from "../../common/auth/current-user.decorator";
import { RequirePermissions } from "../../common/auth/permissions.decorator";
import { AuthenticatedUser } from "../../common/auth/auth.types";
import { ApprovalsService } from "./approvals.service";

@Controller("approvals")
export class ApprovalsController {
  constructor(private readonly approvalsService: ApprovalsService) {}

  @Get()
  @RequirePermissions("approvals.read")
  summary() {
    return this.approvalsService.summary();
  }

  @Post(":module/:id/decision")
  @RequirePermissions("approvals.approve")
  decide(@CurrentUser() user: AuthenticatedUser, @Param("module") module: string, @Param("id") id: string, @Body() body: { decision: "approve" | "reject" }) {
    return this.approvalsService.decide(user, module, id, body.decision);
  }
}
