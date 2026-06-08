import { IsBoolean, IsIn, IsOptional, IsString } from "class-validator";

export class CreateSocialPostDto {
  @IsOptional()
  @IsString()
  authorUserId?: string;

  @IsOptional()
  @IsIn(["ANNOUNCEMENT", "POST", "BIRTHDAY", "RECOGNITION"])
  type?: "ANNOUNCEMENT" | "POST" | "BIRTHDAY" | "RECOGNITION";

  @IsOptional()
  @IsString()
  title?: string;

  @IsString()
  body!: string;

  @IsOptional()
  @IsString()
  mediaUrl?: string;

  @IsOptional()
  @IsString()
  mediaType?: string;

  @IsOptional()
  @IsBoolean()
  pinned?: boolean;
}

export class SocialActorDto {
  @IsOptional()
  @IsString()
  userId?: string;
}

export class CreateSocialCommentDto extends SocialActorDto {
  @IsString()
  body!: string;
}
