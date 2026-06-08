import { Body, Controller, Get, Param, Patch } from "@nestjs/common";
import { RequirePermissions } from "../../common/auth/permissions.decorator";
import { ManagerMappingDto } from "./dto/manager-mapping.dto";
import { OrganizationService } from "./organization.service";

@Controller("organization")
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Get("chart")
  @RequirePermissions("organization.read")
  chart() {
    return this.organizationService.chart();
  }

  @Patch("employees/:id/manager")
  @RequirePermissions("organization.update")
  updateManager(@Param("id") id: string, @Body() body: ManagerMappingDto) {
    return this.organizationService.updateManager(id, body);
  }
}
