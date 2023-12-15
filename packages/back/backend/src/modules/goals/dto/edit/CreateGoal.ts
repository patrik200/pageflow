import { IsDefined, IsOptional, IsString } from "class-validator";
import { Expose } from "class-transformer";

import { dtoMessageIsDefined, dtoMessageIsValidValue } from "constants/dtoErrorMessage";

export class RequestCreateGoalDTO {
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
  @IsString({ message: dtoMessageIsValidValue })
  projectId?: string;
}
