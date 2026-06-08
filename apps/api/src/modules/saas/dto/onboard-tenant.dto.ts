import { IsEmail, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class OnboardTenantDto {
  @IsString()
  @IsNotEmpty()
  companyName!: string;

  @IsString()
  @IsNotEmpty()
  companyLegalName!: string;

  @IsString()
  @IsNotEmpty()
  companyCode!: string;

  @IsEmail()
  adminEmail!: string;

  @IsString()
  @MinLength(6)
  adminPassword!: string;

  @IsString()
  @IsNotEmpty()
  adminFirstName!: string;

  @IsString()
  @IsNotEmpty()
  adminLastName!: string;

  @IsIn(["Basic", "Standard", "Pro"])
  planName!: "Basic" | "Standard" | "Pro";

  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsNumber()
  amount!: number;
}
