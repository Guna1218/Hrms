import { IsDateString, IsOptional, IsString } from "class-validator";

export class CreateHolidayDto {
  @IsString()
  companyId!: string;

  @IsOptional()
  @IsString()
  locationId?: string;

  @IsString()
  name!: string;

  @IsDateString()
  date!: string;

  @IsString()
  type!: string;
}

export class UpdateHolidayStatusDto {
  @IsString()
  status!: string;
}
