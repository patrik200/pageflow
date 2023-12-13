import { IsDefined, IsOptional, IsString, IsBoolean, ValidateNested } from "class-validator";
import { Expose, Type } from "class-transformer";

import { dtoMessageIsDefined, dtoMessageIsValidValue } from "constants/dtoErrorMessage";
import { ResponseMinimalProjectDTO } from "modules/projects/dto/get/Project";
import { ResponseMinimalTimepointDTO } from "./Timepoint";

export class ResponseMinimalGoalDTO {
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
  @Type(() => ResponseMinimalTimepointDTO)
  @ValidateNested({ each: true })
  timepoints!: ResponseMinimalTimepointDTO[];
}

export class ResponseGoalDTO extends ResponseMinimalGoalDTO {
  @Expose()
  @IsOptional()
  @IsString({ message: dtoMessageIsValidValue })
  timePoint?: string;

  project!: ResponseMinimalProjectDTO;

  @Expose()
  @IsDefined({ message: dtoMessageIsDefined })
  @IsBoolean({ message: dtoMessageIsValidValue })
  implemented!: boolean;
}
