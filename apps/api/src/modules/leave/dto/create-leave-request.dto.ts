import { IsDateString, IsNumber, IsString, Min } from "class-validator";

export class CreateLeaveRequestDto {
  @IsString()
  employeeId!: string;

  @IsString()
  leaveTypeId!: string;

  @IsDateString()
  fromDate!: string;

  @IsDateString()
  toDate!: string;

  @IsNumber()
  @Min(0.5)
  days!: number;

  @IsString()
  reason!: string;
}
