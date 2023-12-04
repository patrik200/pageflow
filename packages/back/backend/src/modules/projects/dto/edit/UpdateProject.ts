import { Expose } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";
import { IsDate } from "@app/kit";

import { dtoMessageIsValidValue } from "constants/dtoErrorMessage";

export class RequestUpdateProjectDTO {
  @Expose()
  @IsOptional()
  @IsString({ message: dtoMessageIsValidValue })
  name?: string | null;

  @Expose()
  @IsOptional()
  @IsString({ message: dtoMessageIsValidValue })
  description?: string | null;

  @Expose()
  @IsOptional()
  @IsString({ message: dtoMessageIsValidValue })
  responsibleId?: string | null;

  @Expose()
  @IsOptional()
  @IsDate()
  startDatePlan?: Date | null;

  @Expose()
  @IsOptional()
  @IsDate()
  startDateForecast?: Date | null;

  @Expose()
  @IsOptional()
  @IsDate()
  startDateFact?: Date | null;

  @Expose()
  @IsOptional()
  @IsDate()
  endDatePlan?: Date | null;

  @Expose()
  @IsOptional()
  @IsDate()
  endDateForecast?: Date | null;

  @Expose()
  @IsOptional()
  @IsDate()
  endDateFact?: Date | null;

  @Expose()
  @IsOptional()
  @IsBoolean({ message: dtoMessageIsValidValue })
  isPrivate?: boolean;

  @Expose()
  @IsOptional()
  @IsNumber()
  notifyInDays?: number | null;
}
