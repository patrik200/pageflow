import { IsDefined, IsOptional, IsString } from "class-validator";
import { Expose } from "class-transformer";
import { IsDate } from "@app/kit";

import { dtoMessageIsDefined, dtoMessageIsValidValue } from "constants/dtoErrorMessage";

export class RequestCreateTimePointDTO {
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
  goalId!: string;

  @Expose()
  @IsDefined({ message: dtoMessageIsDefined })
  @IsDate()
  datePlan!: Date;
}
