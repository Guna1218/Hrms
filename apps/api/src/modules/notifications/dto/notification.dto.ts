import { IsIn, IsOptional, IsString } from "class-validator";

export class CreateNotificationDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsIn(["ALL", "HR"])
  audience?: "ALL" | "HR";

  @IsIn(["EMAIL", "WHATSAPP", "PUSH", "IN_APP"])
  channel!: "EMAIL" | "WHATSAPP" | "PUSH" | "IN_APP";

  @IsString()
  title!: string;

  @IsString()
  body!: string;
}
