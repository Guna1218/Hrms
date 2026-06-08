import { IsDateString, IsNumber, IsOptional, IsString, IsUrl, Min } from "class-validator";

export class CreateInsuranceDto {
  @IsString()
  employeeId!: string;

  @IsString()
  provider!: string;

  @IsString()
  policyNumber!: string;

  @IsString()
  policyType!: string;

  @IsNumber()
  @Min(1)
  coverageAmount!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  premiumAmount?: number;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;
}

export class CreateDependentDto {
  @IsString()
  employeeId!: string;

  @IsOptional()
  @IsString()
  insuranceId?: string;

  @IsString()
  fullName!: string;

  @IsString()
  relationship!: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;
}

export class CreateInsuranceClaimDto {
  @IsString()
  employeeId!: string;

  @IsString()
  insuranceId!: string;

  @IsOptional()
  @IsString()
  claimNumber?: string;

  @IsString()
  claimType!: string;

  @IsNumber()
  @Min(1)
  claimAmount!: number;

  @IsDateString()
  claimDate!: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  documentUrl?: string;
}

export class DecideInsuranceClaimDto {
  @IsOptional()
  @IsString()
  decidedBy?: string;
}
