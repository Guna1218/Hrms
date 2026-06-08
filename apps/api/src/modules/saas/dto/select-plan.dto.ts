import { IsIn, IsOptional, IsString, IsNumber } from "class-validator";

export class SelectPlanDto {
  @IsIn(["Basic", "Standard", "Pro"])
  plan!: "Basic" | "Standard" | "Pro";

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsNumber()
  amount?: number;
}
