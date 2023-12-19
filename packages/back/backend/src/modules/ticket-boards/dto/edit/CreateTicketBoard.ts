import { Expose } from "class-transformer";
import { IsBoolean, IsDefined, IsOptional, IsString } from "class-validator";

import { dtoMessageIsDefined, dtoMessageIsValidValue } from "constants/dtoErrorMessage";

export class RequestCreateTicketBoardDTO {
  @Expose() @IsOptional() @IsString({ message: dtoMessageIsValidValue }) projectId?: string;

  @Expose() @IsDefined({ message: dtoMessageIsDefined }) @IsString({ message: dtoMessageIsValidValue }) name!: string;

  @Expose() @IsDefined({ message: dtoMessageIsDefined }) @IsString({ message: dtoMessageIsValidValue }) slug!: string;

  @Expose()
  @IsDefined({ message: dtoMessageIsDefined })
  @IsBoolean({ message: dtoMessageIsValidValue })
  isPrivate!: boolean;
}
