import { Body, Controller, Get, Param, Patch } from "@nestjs/common";
import { Public } from "../../common/auth/public.decorator";
import { RequirePermissions } from "../../common/auth/permissions.decorator";
import { UpdateClientRulesDto, UpdateCompanyDto, UpdateModuleDto } from "./dto/settings.dto";
import { SettingsService } from "./settings.service";

@Controller("settings")
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  /**
   * Public endpoint — returns branding/logo data for the login page
   * (no tenant context required, falls back to defaults)
   */
  @Public()
  @Get("public-profile")
  publicProfile() {
    return this.settingsService.publicProfile();
  }

  /**
   * Any authenticated user can read their company's settings
   * (needed for branding injection in the app shell)
   */
  @Get("rules")
  rules() {
    return this.settingsService.rules();
  }

  /**
   * Only HR Admin / users with settings.configure permission can view/change company profile
   */
  @Get("company")
  @RequirePermissions("settings.configure")
  company() {
    return this.settingsService.company();
  }

  @Patch("company")
  @RequirePermissions("settings.configure")
  updateCompany(@Body() body: UpdateCompanyDto) {
    return this.settingsService.updateCompany(body);
  }

  @Get("modules")
  @RequirePermissions("settings.configure")
  modules() {
    return this.settingsService.modules();
  }

  @Patch("modules/:module")
  @RequirePermissions("settings.configure")
  updateModule(@Param("module") module: string, @Body() body: UpdateModuleDto) {
    return this.settingsService.updateModule(module, body);
  }

  @Patch("rules")
  @RequirePermissions("settings.configure")
  updateRules(@Body() body: UpdateClientRulesDto) {
    return this.settingsService.updateRules(body);
  }

  @Get("logs")
  @RequirePermissions("settings.configure")
  logs() {
    return this.settingsService.logs();
  }
}
