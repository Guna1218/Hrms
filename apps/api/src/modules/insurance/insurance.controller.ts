import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { RequirePermissions } from "../../common/auth/permissions.decorator";
import { CreateDependentDto, CreateInsuranceClaimDto, CreateInsuranceDto, DecideInsuranceClaimDto } from "./dto/insurance.dto";
import { InsuranceService } from "./insurance.service";

@Controller("insurance")
export class InsuranceController {
  constructor(private readonly insuranceService: InsuranceService) {}

  @Get("policies")
  @RequirePermissions("insurance.read")
  policies() {
    return this.insuranceService.policies();
  }

  @Get("dependents")
  @RequirePermissions("insurance.read")
  dependents() {
    return this.insuranceService.dependents();
  }

  @Get("claims")
  @RequirePermissions("insurance.read")
  claims() {
    return this.insuranceService.claims();
  }

  @Post("policies")
  @RequirePermissions("insurance.create")
  createPolicy(@Body() body: CreateInsuranceDto) {
    return this.insuranceService.createPolicy(body);
  }

  @Post("dependents")
  @RequirePermissions("insurance.create")
  addDependent(@Body() body: CreateDependentDto) {
    return this.insuranceService.addDependent(body);
  }

  @Post("claims")
  @RequirePermissions("insurance.create")
  createClaim(@Body() body: CreateInsuranceClaimDto) {
    return this.insuranceService.createClaim(body);
  }

  @Patch("claims/:id/approve")
  @RequirePermissions("insurance.approve")
  approveClaim(@Param("id") id: string, @Body() body: DecideInsuranceClaimDto) {
    return this.insuranceService.decideClaim(id, "approve", body);
  }

  @Patch("claims/:id/reject")
  @RequirePermissions("insurance.approve")
  rejectClaim(@Param("id") id: string, @Body() body: DecideInsuranceClaimDto) {
    return this.insuranceService.decideClaim(id, "reject", body);
  }
}
