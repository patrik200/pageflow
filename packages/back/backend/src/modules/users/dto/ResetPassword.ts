import { IsDefined, IsEmail, IsString } from "class-validator";
import { Expose } from "class-transformer";

import { dtoMessageIsDefined, dtoMessageIsValidValue } from "constants/dtoErrorMessage";

export class RequestResetPasswordInitialDTO {
  @Expose()
  @IsDefined({ message: dtoMessageIsDefined })
  @IsEmail(undefined, { message: dtoMessageIsValidValue })
  email!: string;

  @Expose()
  @IsDefined({ message: dtoMessageIsDefined })
  @IsString({ message: dtoMessageIsValidValue })
  clientId!: string;
}

export class RequestResetPasswordFinishDTO {
  @Expose()
  @IsDefined({ message: dtoMessageIsDefined })
  @IsString({ message: dtoMessageIsValidValue })
  token!: string;

  @Expose()
  @IsDefined({ message: dtoMessageIsDefined })
  @IsString({ message: dtoMessageIsValidValue })
  password!: string;
}
