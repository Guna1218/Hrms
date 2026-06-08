import { Body, Controller, Get, Post } from "@nestjs/common";
import { RequirePermissions } from "../../common/auth/permissions.decorator";
import { AwardPointsDto, CreateBenefitDto, CreateRecognitionDto, CreateVoucherDto } from "./dto/rewards.dto";
import { RewardsService } from "./rewards.service";

@Controller("rewards")
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get()
  @RequirePermissions("rewards.read")
  summary() {
    return this.rewardsService.summary();
  }

  @Post("vouchers")
  @RequirePermissions("rewards.create")
  createVoucher(@Body() body: CreateVoucherDto) {
    return this.rewardsService.createVoucher(body);
  }

  @Post("benefits")
  @RequirePermissions("rewards.create")
  createBenefit(@Body() body: CreateBenefitDto) {
    return this.rewardsService.createBenefit(body);
  }

  @Post("points")
  @RequirePermissions("rewards.create")
  awardPoints(@Body() body: AwardPointsDto) {
    return this.rewardsService.awardPoints(body);
  }

  @Post("recognitions")
  @RequirePermissions("rewards.create")
  recognize(@Body() body: CreateRecognitionDto) {
    return this.rewardsService.recognize(body);
  }
}
