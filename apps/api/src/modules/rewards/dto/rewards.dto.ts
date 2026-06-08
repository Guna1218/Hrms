import { IsInt, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateVoucherDto {
  @IsString()
  code!: string;

  @IsString()
  title!: string;

  @IsString()
  provider!: string;

  @IsNumber()
  @Min(0)
  valueAmount!: number;

  @IsInt()
  @Min(1)
  pointsCost!: number;
}

export class AwardPointsDto {
  @IsString()
  employeeId!: string;

  @IsInt()
  points!: number;

  @IsString()
  reason!: string;

  @IsOptional()
  @IsString()
  source?: string;
}

export class CreateRecognitionDto {
  @IsString()
  recipientEmployeeId!: string;

  @IsString()
  title!: string;

  @IsString()
  message!: string;

  @IsOptional()
  @IsInt()
  points?: number;
}

export class CreateBenefitDto {
  @IsString()
  title!: string;

  @IsString()
  provider!: string;

  @IsString()
  category!: string;

  @IsString()
  description!: string;

  @IsOptional()
  @IsInt()
  pointsCost?: number;
}
