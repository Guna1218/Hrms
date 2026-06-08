import { Controller, Get, Param, Post } from "@nestjs/common";
import { RequirePermissions } from "../../common/auth/permissions.decorator";
import { ComplianceService } from "./compliance.service";

@Controller("compliance")
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @Get()
  @RequirePermissions("compliance.read")
  summary() {
    return this.complianceService.summary();
  }

  @Post("export/:type")
  @RequirePermissions("compliance.export")
  export(@Param("type") type: string) {
    return this.complianceService.export(type);
  }
}
