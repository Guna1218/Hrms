import { IsDateString, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateEmployeeDocumentDto {
  @IsString()
  documentType!: string;

  @IsUrl({ require_tld: false })
  fileUrl!: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}

export class VerifyEmployeeDocumentDto {
  @IsOptional()
  @IsString()
  verifiedBy?: string;
}
