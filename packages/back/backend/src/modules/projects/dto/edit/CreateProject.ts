import { Expose } from "class-transformer";
import { IsDefined, IsNumber, IsString, IsOptional } from "class-validator";
import { IsDate, IsBooleanConverter, withDefaultValue } from "@app/kit";

import { dtoMessageIsDefined, dtoMessageIsValidValue } from "constants/dtoErrorMessage";

export class RequestCreateProjectDTO {
  @Expose()
  @IsDefined({ message: dtoMessageIsDefined })
  @IsString({ message: dtoMessageIsValidValue })
  name!: string;

  @Expose()
  @IsOptional()
  @IsString({ message: dtoMessageIsValidValue })
  description?: string;

  @Expose()
  @IsOptional()
  @IsString({ message: dtoMessageIsValidValue })
  responsibleId?: string;

  @Expose()
  @IsOptional()
  @IsString({ message: dtoMessageIsValidValue })
  contractorId?: string;

  @Expose()
  @IsOptional()
  @IsDate()
  startDatePlan?: Date;

  @Expose()
  @IsOptional()
  @IsDate()
  startDateForecast?: Date;

  @Expose()
  @IsOptional()
  @IsDate()
  startDateFact?: Date;

  @Expose()
  @IsOptional()
  @IsDate()
  endDatePlan?: Date;

  @Expose()
  @IsOptional()
  @IsDate()
  endDateForecast?: Date;

  @Expose()
  @IsOptional()
  @IsDate()
  endDateFact?: Date;

  @Expose()
  @IsOptional()
  @IsBooleanConverter()
  isPrivate!: boolean;

  @Expose()
  @IsOptional()
  @IsNumber()
  @withDefaultValue(null)
  notifyInDays!: number | null;
}
