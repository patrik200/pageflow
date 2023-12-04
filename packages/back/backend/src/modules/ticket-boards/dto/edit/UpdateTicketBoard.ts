import { Expose } from "class-transformer";
import { IsBoolean, IsOptional, IsString } from "class-validator";

import { dtoMessageIsValidValue } from "constants/dtoErrorMessage";

export class RequestUpdateTicketBoardDTO {
  @Expose() @IsOptional() @IsString({ message: dtoMessageIsValidValue }) name?: string;

  @Expose() @IsOptional() @IsBoolean({ message: dtoMessageIsValidValue }) isPrivate?: boolean;
}
