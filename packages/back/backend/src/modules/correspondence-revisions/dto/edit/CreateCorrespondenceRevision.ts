import { Expose } from "class-transformer";
import { IsDefined, IsString, MinLength } from "class-validator";

import { dtoMessageIsDefined, dtoMessageIsValidValue } from "constants/dtoErrorMessage";

export class RequestCreateCorrespondenceRevisionDTO {
  @Expose()
  @IsDefined({ message: dtoMessageIsDefined })
  @IsString({ message: dtoMessageIsValidValue })
  @MinLength(1, { message: dtoMessageIsValidValue })
  number!: string;
}
