import { Controller, Get, Param, Post } from "@nestjs/common";
import { CurrentUser } from "../../common/auth/current-user.decorator";
import { RequirePermissions } from "../../common/auth/permissions.decorator";
import { AuthenticatedUser } from "../../common/auth/auth.types";
import { AssetsService } from "./assets.service";

@Controller("assets")
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  @RequirePermissions("assets.read")
  summary() {
    return this.assetsService.summary();
  }

  @Post(":assetTag/assign")
  @RequirePermissions("assets.configure")
  assign(@CurrentUser() user: AuthenticatedUser, @Param("assetTag") assetTag: string) {
    return this.assetsService.assign(user, assetTag);
  }

  @Post(":assetTag/return")
  @RequirePermissions("assets.configure")
  returnAsset(@CurrentUser() user: AuthenticatedUser, @Param("assetTag") assetTag: string) {
    return this.assetsService.returnAsset(user, assetTag);
  }
}
