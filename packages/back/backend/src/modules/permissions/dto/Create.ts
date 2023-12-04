import { IsBoolean, IsDefined, IsEnum, IsOptional, IsString } from "class-validator";
import { PermissionRole } from "@app/shared-enums";
import { Expose } from "class-transformer";

export class RequestCreatePermissionDTO {
  @Expose() @IsDefined() @IsEnum(PermissionRole) role!: PermissionRole;

  @Expose() @IsDefined() @IsString() userId!: string;

  @Expose() @IsOptional() @IsBoolean() canEditEditorPermissions?: boolean;

  @Expose() @IsOptional() @IsBoolean() canEditReaderPermissions?: boolean;
}
