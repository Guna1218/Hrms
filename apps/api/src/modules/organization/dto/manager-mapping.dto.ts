import { IsOptional, IsString } from "class-validator";

export class ManagerMappingDto {
  @IsOptional()
  @IsString()
  managerId?: string;
}
