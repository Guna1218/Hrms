import { IsDateString, IsNumber, IsOptional, IsString, IsUrl, Min } from "class-validator";

export class CreateExpenseDto {
  @IsString()
  employeeId!: string;

  @IsString()
  category!: string;

  @IsNumber()
  @Min(1)
  amount!: number;

  @IsOptional()
  @IsUrl({ require_tld: false })
  receiptUrl?: string;

  @IsDateString()
  claimDate!: string;
}

export class DecideExpenseDto {
  @IsOptional()
  @IsString()
  decidedBy?: string;

  @IsOptional()
  @IsString()
  note?: string;
}
