import { PermissionRole } from "@app/shared-enums";
import { Expose } from "class-transformer";
import { IsDefined, IsString, IsEnum, IsOptional } from "class-validator";

import { dtoMessageIsDefined, dtoMessageIsValidValue } from "constants/dtoErrorMessage";

export class RequestTransferProjectPermissionOwnerDTO {
  @Expose()
  @IsDefined({ message: dtoMessageIsDefined })
  @IsString({ message: dtoMessageIsValidValue })
  userId!: string;

  @Expose()
  @IsOptional()
  @IsEnum(PermissionRole, { message: dtoMessageIsValidValue })
  newRoleForCurrentUser!: PermissionRole | null;
}
