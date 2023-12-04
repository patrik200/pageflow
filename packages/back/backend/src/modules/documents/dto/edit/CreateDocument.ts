import { IsBooleanConverter, IsDate } from "@app/kit";
import { IsDefined, IsOptional, IsString, ValidateNested } from "class-validator";
import { Expose, Type } from "class-transformer";

import { dtoMessageIsDefined, dtoMessageIsValidValue } from "constants/dtoErrorMessage";

import { RequestAttributeForEntityDTO } from "modules/attributes/dto/get-for-entity/Attributes";

export class RequestCreateDocumentDTO {
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
  parentGroupId?: string;

  @Expose()
  @IsOptional()
  @IsString({ message: dtoMessageIsValidValue })
  projectId?: string;

  @Expose()
  @IsOptional()
  @IsString({ message: dtoMessageIsValidValue })
  remarks?: string;

  @Expose()
  @IsOptional()
  @IsString({ message: dtoMessageIsValidValue })
  responsibleUserId?: string;

  @Expose()
  @IsOptional()
  @IsString({ message: dtoMessageIsValidValue })
  responsibleUserFlowId?: string;

  @Expose()
  @IsOptional()
  @IsString({ message: dtoMessageIsValidValue })
  typeKey?: string;

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
  @Type(() => RequestAttributeForEntityDTO)
  @ValidateNested({ each: true })
  attributes?: RequestAttributeForEntityDTO[];
}
