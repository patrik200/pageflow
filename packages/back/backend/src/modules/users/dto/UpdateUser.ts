import { IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsString } from "class-validator";
import { UserRole } from "@app/shared-enums";
import { Expose } from "class-transformer";
import { IsDate } from "@app/kit";

import { dtoMessageIsValidValue } from "constants/dtoErrorMessage";

export class RequestUpdateUserDTO {
  @Expose()
  @IsOptional()
  @IsEnum(UserRole, { message: dtoMessageIsValidValue })
  role?: UserRole;

  @Expose()
  @IsOptional()
  @IsString({ message: dtoMessageIsValidValue })
  name?: string;

  @Expose()
  @IsOptional()
  @IsString({ message: dtoMessageIsValidValue })
  position?: string;

  @Expose()
  @IsOptional()
  @IsPhoneNumber(undefined, { message: dtoMessageIsValidValue })
  phone?: string;

  @Expose()
  @IsOptional()
  @IsEmail(undefined, { message: dtoMessageIsValidValue })
  email?: string;

  @Expose()
  @IsOptional()
  @IsString({ message: dtoMessageIsValidValue })
  password?: string;

  @Expose() @IsOptional() @IsDate() unavailableUntil!: Date | null;
}
