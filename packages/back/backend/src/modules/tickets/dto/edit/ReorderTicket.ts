import { Expose } from "class-transformer";
import { IsDefined, IsString } from "class-validator";

import { dtoMessageIsValidValue } from "constants/dtoErrorMessage";

export class RequestReorderTicketDTO {
  @Expose() @IsDefined() @IsString({ message: dtoMessageIsValidValue }) statusKey!: string;

  @Expose() @IsDefined() @IsString({ message: dtoMessageIsValidValue, each: true }) ticketIds!: string[];
}
