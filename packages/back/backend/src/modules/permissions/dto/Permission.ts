import { PermissionRole } from "@app/shared-enums";
import { Expose, Type } from "class-transformer";
import { IsBoolean, IsDefined, IsEnum, IsOptional, ValidateNested } from "class-validator";

import { ResponseProfileDTO } from "modules/users";

export class ResponsePermissionDTO {
  @Expose() @IsDefined() @IsEnum(PermissionRole) role!: PermissionRole;

  @Expose() @IsDefined() @Type(() => ResponseProfileDTO) @ValidateNested() user!: ResponseProfileDTO;

  @Expose() @IsOptional() @IsBoolean() canEditEditorPermissions?: boolean;

  @Expose() @IsOptional() @IsBoolean() canEditReaderPermissions?: boolean;
}

export class ResponsePermissionsListDTO {
  @Expose()
  @IsDefined()
  @Type(() => ResponsePermissionDTO)
  @ValidateNested({ each: true })
  list!: ResponsePermissionDTO[];
}
