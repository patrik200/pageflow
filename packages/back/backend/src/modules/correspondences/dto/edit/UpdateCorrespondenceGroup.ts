import { Expose } from "class-transformer";
import { IsString, IsOptional, IsBoolean } from "class-validator";

import { dtoMessageIsValidValue } from "constants/dtoErrorMessage";

export class RequestUpdateCorrespondenceGroupDTO {
  @Expose()
  @IsOptional()
  @IsString({ message: dtoMessageIsValidValue })
  name?: string;

  @Expose()
  @IsOptional()
  @IsString({ message: dtoMessageIsValidValue })
  description?: string;

  @Expose()
  @IsOptional()
  @IsBoolean({ message: dtoMessageIsValidValue })
  isPrivate?: boolean;
}
