import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { RequirePermissions } from "../../common/auth/permissions.decorator";
import { CurrentUser } from "../../common/auth/current-user.decorator";
import { AuthenticatedUser } from "../../common/auth/auth.types";
import { LeaveService } from "./leave.service";
import { CreateLeaveRequestDto } from "./dto/create-leave-request.dto";
import { DecideLeaveRequestDto } from "./dto/decide-leave-request.dto";

@Controller("leave")
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Get("types")
  @RequirePermissions("leave.read")
  types() {
    return this.leaveService.types();
  }

  @Patch("types/:id")
  @RequirePermissions("leave.configure")
  updateType(@Param("id") id: string, @Body() body: any) {
    return this.leaveService.updateType(id, body);
  }

  @Post("types")
  @RequirePermissions("leave.configure")
  createType(@Body() body: any) {
    return this.leaveService.createType(body);
  }

  @Get("assignments")
  @RequirePermissions("leave.read")
  getAssignments() {
    return this.leaveService.getAssignments();
  }

  @Post("assignments")
  @RequirePermissions("leave.configure")
  assignRules(@Body() body: any) {
    return this.leaveService.assignRules(body);
  }

  @Post("assignments/delete")
  @RequirePermissions("leave.configure")
  unassignRules(@Body() body: any) {
    return this.leaveService.unassignRules(body);
  }

  @Get("balances")
  @RequirePermissions("leave.read")
  balances() {
    return this.leaveService.balances();
  }

  @Get("requests")
  @RequirePermissions("leave.read")
  requests() {
    return this.leaveService.requests();
  }

  @Post("requests")
  @RequirePermissions("leave.create")
  request(@Body() body: CreateLeaveRequestDto) {
    return this.leaveService.request(body);
  }

  @Patch("requests/:id/approve")
  @RequirePermissions("leave.approve")
  approve(
    @Param("id") id: string,
    @Body() body: DecideLeaveRequestDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    if (!body.decidedByUserId) {
      body.decidedByUserId = user.sub;
    }
    return this.leaveService.approve(id, body);
  }

  @Patch("requests/:id/reject")
  @RequirePermissions("leave.approve")
  reject(
    @Param("id") id: string,
    @Body() body: DecideLeaveRequestDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    if (!body.decidedByUserId) {
      body.decidedByUserId = user.sub;
    }
    return this.leaveService.reject(id, body);
  }
}

