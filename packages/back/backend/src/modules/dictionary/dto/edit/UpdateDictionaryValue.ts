import { Expose } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

import { dtoMessageIsValidValue } from "constants/dtoErrorMessage";

export class RequestUpdateDictionaryValueDTO {
  @Expose()
  @IsOptional()
  @IsString({ message: dtoMessageIsValidValue })
  value?: string;
}
