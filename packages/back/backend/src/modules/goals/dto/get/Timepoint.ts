import { IsDefined, IsOptional, IsString, IsNumber } from "class-validator";
import { Expose } from "class-transformer";

import { dtoMessageIsDefined, dtoMessageIsValidValue } from "constants/dtoErrorMessage";
import { IsDate } from "@app/kit";

export class ResponseTimepointDTO {
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

  @Expose() @IsDefined() @IsDate() datePlan!: Date;

  @Expose() @IsDefined() @IsNumber() remainingDays!: number;
}
