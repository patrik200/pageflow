import { Expose } from "class-transformer";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { TicketPriorities } from "@app/shared-enums";
import { IsDate } from "@app/kit";

import { dtoMessageIsValidValue } from "constants/dtoErrorMessage";

export class RequestUpdateTicketDTO {
  @Expose() @IsOptional() @IsString({ message: dtoMessageIsValidValue }) name?: string;

  @Expose() @IsOptional() @IsString({ message: dtoMessageIsValidValue }) description?: string;

  @Expose() @IsOptional() @IsDate() deadlineAt?: Date | null;

  @Expose() @IsOptional() @IsString({ message: dtoMessageIsValidValue }) responsibleId?: string | null;

  @Expose() @IsOptional() @IsString({ message: dtoMessageIsValidValue }) customerId?: string | null;

  @Expose() @IsOptional() @IsEnum(TicketPriorities, { message: dtoMessageIsValidValue }) priority?: TicketPriorities;

  @Expose() @IsOptional() @IsString({ message: dtoMessageIsValidValue }) typeKey?: string | null;

  @Expose() @IsOptional() @IsString({ message: dtoMessageIsValidValue }) statusKey?: string;
}
