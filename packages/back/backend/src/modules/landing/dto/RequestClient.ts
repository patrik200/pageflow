import { Expose } from "class-transformer";
import { IsDefined, IsEmail, IsString, MinLength } from "class-validator";

import { dtoMessageIsDefined, dtoMessageIsValidValue } from "constants/dtoErrorMessage";

export class RequestLandingClientDTO {
  @Expose()
  @IsDefined({ message: dtoMessageIsDefined })
  @MinLength(1, { message: dtoMessageIsValidValue })
  @IsString({ message: dtoMessageIsValidValue })
  name!: string;

  @Expose()
  @IsDefined({ message: dtoMessageIsDefined })
  @MinLength(1, { message: dtoMessageIsValidValue })
  @IsString({ message: dtoMessageIsValidValue })
  companyName!: string;

  @Expose()
  @IsDefined({ message: dtoMessageIsDefined })
  @MinLength(1, { message: dtoMessageIsValidValue })
  @IsString({ message: dtoMessageIsValidValue })
  domain!: string;

  @Expose()
  @IsDefined({ message: dtoMessageIsDefined })
  @IsEmail(undefined, { message: dtoMessageIsValidValue })
  email!: string;
}
