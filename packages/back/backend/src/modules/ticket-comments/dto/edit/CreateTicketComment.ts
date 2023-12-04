import { Expose } from "class-transformer";
import { IsDefined, IsOptional, IsString } from "class-validator";

import { dtoMessageIsDefined, dtoMessageIsValidValue } from "constants/dtoErrorMessage";

export class RequestCreateTicketCommentDTO {
  @Expose() @IsDefined({ message: dtoMessageIsDefined }) @IsString({ message: dtoMessageIsValidValue }) text!: string;

  @Expose() @IsOptional() @IsString({ message: dtoMessageIsValidValue }) replyForCommentId?: string;
}
