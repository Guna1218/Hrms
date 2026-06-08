import { IsDateString, IsInt, IsOptional, IsString, IsUrl, Min } from "class-validator";

export class CreateJobDto {
  @IsString()
  companyId!: string;

  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  departmentId?: string;

  @IsOptional()
  @IsString()
  locationId?: string;

  @IsInt()
  @Min(1)
  openings!: number;
}

export class CreateCandidateDto {
  @IsString()
  fullName!: string;

  @IsString()
  email!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  resumeUrl?: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  jobPostingId?: string;
}

export class MoveApplicationStageDto {
  @IsString()
  stage!: string;

  @IsOptional()
  @IsString()
  status?: string;
}

export class ScheduleInterviewDto {
  @IsString()
  applicationId!: string;

  @IsOptional()
  @IsString()
  interviewerEmployeeId?: string;

  @IsDateString()
  scheduledAt!: string;

  @IsString()
  mode!: string;
}

export class CreateOfferDto {
  @IsString()
  applicationId!: string;
}
