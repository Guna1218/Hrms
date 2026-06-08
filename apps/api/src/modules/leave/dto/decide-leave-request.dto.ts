import { IsOptional, IsString } from "class-validator";

export class DecideLeaveRequestDto {
  @IsOptional()
  @IsString()
  decidedByUserId?: string;

  @IsOptional()
  @IsString()
  note?: string;
}
