import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { RequirePermissions } from "../../common/auth/permissions.decorator";
import { CreateCandidateDto, CreateJobDto, CreateOfferDto, MoveApplicationStageDto, ScheduleInterviewDto } from "./dto/ats.dto";
import { AtsService } from "./ats.service";

@Controller("ats")
export class AtsController {
  constructor(private readonly atsService: AtsService) {}

  @Get("jobs")
  @RequirePermissions("ats.read")
  jobs() {
    return this.atsService.jobs();
  }

  @Post("jobs")
  @RequirePermissions("ats.create")
  createJob(@Body() body: CreateJobDto) {
    return this.atsService.createJob(body);
  }

  @Get("candidates")
  @RequirePermissions("ats.read")
  candidates() {
    return this.atsService.candidates();
  }

  @Post("candidates")
  @RequirePermissions("ats.create")
  createCandidate(@Body() body: CreateCandidateDto) {
    return this.atsService.createCandidate(body);
  }

  @Patch("applications/:id/stage")
  @RequirePermissions("ats.update")
  moveStage(@Param("id") id: string, @Body() body: MoveApplicationStageDto) {
    return this.atsService.moveStage(id, body);
  }

  @Post("interviews")
  @RequirePermissions("ats.update")
  scheduleInterview(@Body() body: ScheduleInterviewDto) {
    return this.atsService.scheduleInterview(body);
  }

  @Post("offers")
  @RequirePermissions("ats.approve")
  createOffer(@Body() body: CreateOfferDto) {
    return this.atsService.createOffer(body);
  }
}
