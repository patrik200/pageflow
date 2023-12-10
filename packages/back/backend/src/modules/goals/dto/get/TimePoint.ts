import { IsDefined, IsOptional, IsString, IsBoolean } from "class-validator";
import { Expose } from "class-transformer";

import { dtoMessageIsDefined, dtoMessageIsValidValue } from "constants/dtoErrorMessage";
import { ResponseMinimalProjectDTO } from "modules/projects/dto/get/Project";
import { ResponseMinimalGoalDTO } from "./Goal";
import { IsDate } from "@app/kit";

export class ResponseMinimalTimePointDTO {
  @Expose()
  @IsDefined({ message: dtoMessageIsDefined })
  @IsString({ message: dtoMessageIsValidValue })
  id!: string;

  @Expose()
  @IsDefined({ message: dtoMessageIsDefined })
  @IsString({ message: dtoMessageIsValidValue })
  name!: string;

  @Expose()
  @IsOptional()
  @IsString({ message: dtoMessageIsValidValue })
  description?: string;
}

export class ResponseTimePointDTO extends ResponseMinimalTimePointDTO {

  goal!: ResponseMinimalGoalDTO;

  @Expose()
  @IsDefined({ message: dtoMessageIsDefined })
  @IsBoolean({ message: dtoMessageIsValidValue })
  implemented!: boolean;

  @Expose() @IsOptional() @IsDate() startDateFact?: Date;
  @Expose() @IsOptional() @IsDate() startDatePlan?: Date;
}