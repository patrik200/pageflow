import { IsBoolean, IsOptional, IsString, ValidateNested } from "class-validator";
import { Expose, Type } from "class-transformer";
import { IsDate } from "@app/kit";

import { dtoMessageIsValidValue } from "constants/dtoErrorMessage";

import { RequestAttributeForEntityDTO } from "modules/attributes/dto/get-for-entity/Attributes";

export class RequestUpdateDocumentDTO {
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
  @IsString({ message: dtoMessageIsValidValue })
  remarks?: string;

  @Expose()
  @IsOptional()
  @IsString({ message: dtoMessageIsValidValue })
  responsibleUserId?: string | null;

  @Expose()
  @IsOptional()
  @IsString({ message: dtoMessageIsValidValue })
  responsibleUserFlowId?: string | null;

  @Expose()
  @IsOptional()
  @IsString({ message: dtoMessageIsValidValue })
  typeKey?: string | null;

  @Expose()
  @IsOptional()
  @IsString({ message: dtoMessageIsValidValue })
  contractorId?: string | null;

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
  @Type(() => RequestAttributeForEntityDTO)
  @ValidateNested({ each: true })
  attributes?: RequestAttributeForEntityDTO[];
}
