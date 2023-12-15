import { IsOptional, IsString } from "class-validator";
import { Expose } from "class-transformer";
import { IsDate } from "@app/kit";

import { dtoMessageIsValidValue } from "constants/dtoErrorMessage";

export class RequestEditTimepointDTO {
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
  @IsDate()
  datePlan?: Date;
}
