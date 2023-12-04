import { IsBoolean, IsDefined, IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";
import { Expose, Type } from "class-transformer";
import { UserRole } from "@app/shared-enums";
import { StorageFileDTO } from "@app/back-kit";
import { IsDate } from "@app/kit";

export class ResponseProfileDTO {
  @Expose() @IsDefined() @IsString() id!: string;

  @Expose() @IsDefined() @IsString() email!: string;

  @Expose() @IsDefined() @IsEnum(UserRole) role!: UserRole;

  @Expose() @IsDefined() @IsString() name!: string;

  @Expose() @IsOptional() @IsString() position?: string;

  @Expose() @IsOptional() @IsString() phone?: string;

  @Expose() @IsOptional() @Type(() => StorageFileDTO) @ValidateNested() avatar?: StorageFileDTO;

  @Expose() @IsOptional() @IsBoolean() canUpdate?: boolean;

  @Expose() @IsOptional() @IsBoolean() canDelete?: boolean;

  @Expose() @IsOptional() @IsBoolean() canRestore?: boolean;

  @Expose() @IsOptional() @IsDate() unavailableUntil!: Date | null;
}
