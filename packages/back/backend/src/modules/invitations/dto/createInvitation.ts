import { IsDefined, IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsString } from "class-validator";
import { Expose } from "class-transformer";
import { UserRole } from "@app/shared-enums";

import { dtoMessageIsDefined, dtoMessageIsValidValue } from "constants/dtoErrorMessage";

export class RequestCreateInvitationDTO {
  @Expose()
  @IsDefined({ message: dtoMessageIsDefined })
  @IsEmail(undefined, { message: dtoMessageIsValidValue })
  email!: string;

  @Expose()
  @IsDefined({ message: dtoMessageIsDefined })
  @IsEnum(UserRole, { message: dtoMessageIsValidValue })
  role!: UserRole;

  @Expose()
  @IsDefined({ message: dtoMessageIsDefined })
  @IsString({ message: dtoMessageIsDefined })
  name!: string;

  @Expose()
  @IsOptional()
  @IsString({ message: dtoMessageIsValidValue })
  position?: string;

  @Expose()
  @IsOptional()
  @IsPhoneNumber(undefined, { message: dtoMessageIsValidValue })
  phone?: string;
}
