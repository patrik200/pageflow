import { PermissionRole } from "@app/shared-enums";
import { Expose } from "class-transformer";
import { IsEnum, IsBoolean, IsOptional, IsString } from "class-validator";

import { dtoMessageIsValidValue } from "constants/dtoErrorMessage";

export class RequestUpdateProjectPermissionDTO {
  @Expose()
  @IsOptional()
  @IsString({ message: dtoMessageIsValidValue })
  userId?: string;

  @Expose()
  @IsOptional()
  @IsEnum(PermissionRole, { message: dtoMessageIsValidValue })
  role?: PermissionRole;

  @Expose()
  @IsOptional()
  @IsBoolean()
  canEditEditorPermissions?: boolean;

  @Expose()
  @IsOptional()
  @IsBoolean()
  canEditReaderPermissions?: boolean;
}
