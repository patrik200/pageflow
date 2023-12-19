import { IsDefined, IsOptional, IsString, IsBoolean, ValidateNested } from "class-validator";
import { Expose, Type } from "class-transformer";

import { dtoMessageIsDefined, dtoMessageIsValidValue } from "constants/dtoErrorMessage";

import { ResponseTimepointDTO } from "./Timepoint";

export class ResponseGoalDTO {
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

  @Expose()
  @IsDefined({ message: dtoMessageIsDefined })
  @Type(() => ResponseTimepointDTO)
  @ValidateNested({ each: true })
  timepoints!: ResponseTimepointDTO[];
}

export class ResponseGoalsListDTO {
  @Expose() @IsDefined() @Type(() => ResponseGoalDTO) @ValidateNested({ each: true }) list!: ResponseGoalDTO[];
}
