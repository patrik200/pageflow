import { IsDefined, IsOptional, IsPhoneNumber, IsString } from "class-validator";
import { Expose } from "class-transformer";

import { dtoMessageIsDefined, dtoMessageIsValidValue } from "constants/dtoErrorMessage";

export class RequestCreateUserByInvitationDTO {
  @Expose()
  @IsDefined({ message: dtoMessageIsDefined })
  @IsString({ message: dtoMessageIsValidValue })
  invitation!: string;

  @Expose()
  @IsDefined({ message: dtoMessageIsDefined })
  @IsString({ message: dtoMessageIsValidValue })
  name!: string;

  @Expose()
  @IsDefined({ message: dtoMessageIsDefined })
  @IsString({ message: dtoMessageIsValidValue })
  password!: string;

  @Expose()
  @IsOptional({ message: dtoMessageIsDefined })
  @IsPhoneNumber(undefined, { message: dtoMessageIsValidValue })
  phone?: string;
}
