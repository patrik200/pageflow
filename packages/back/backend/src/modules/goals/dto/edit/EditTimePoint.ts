import { IsDefined, IsOptional, IsString, IsBoolean } from "class-validator";
import { Expose } from "class-transformer";

import { dtoMessageIsDefined, dtoMessageIsValidValue } from "constants/dtoErrorMessage";
import { IsDate } from "@app/kit";

export class RequestEditTimePointDTO {
  @Expose()
  @IsDefined({ message: dtoMessageIsDefined })
  @IsString({ message: dtoMessageIsValidValue })
  name?: string;

  @Expose()
  @IsOptional()
  @IsString({ message: dtoMessageIsValidValue })
  description?: string;

  @Expose()
  @IsOptional()
  @IsDate()
  startDatePlan?: Date;

  @Expose()
  @IsOptional()
  @IsDate()
  startDateFact?: Date;
}
