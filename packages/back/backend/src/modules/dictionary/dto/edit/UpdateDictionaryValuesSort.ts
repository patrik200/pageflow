import { Expose } from "class-transformer";
import { IsDefined, IsString } from "class-validator";

import { dtoMessageIsValidValue } from "constants/dtoErrorMessage";

export class RequestUpdateDictionaryValuesSortDTO {
  @Expose()
  @IsDefined()
  @IsString({ each: true, message: dtoMessageIsValidValue })
  keys!: string[];
}
