import { Expose } from "class-transformer";
import { IsString, IsOptional } from "class-validator";

import { dtoMessageIsValidValue } from "constants/dtoErrorMessage";

export class RequestUpdateCorrespondenceRevisionDTO {
  @Expose()
  @IsOptional()
  @IsString({ message: dtoMessageIsValidValue })
  number?: string;
}
