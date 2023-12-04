import { Expose } from "class-transformer";
import { IsDefined, IsEnum, IsOptional, IsString } from "class-validator";
import { TicketPriorities } from "@app/shared-enums";
import { IsDate } from "@app/kit";

import { dtoMessageIsDefined, dtoMessageIsValidValue } from "constants/dtoErrorMessage";

export class RequestCreateTicketDTO {
  @Expose()
  @IsDefined({ message: dtoMessageIsDefined })
  @IsString({ message: dtoMessageIsValidValue })
  boardId!: string;

  @Expose() @IsDefined({ message: dtoMessageIsDefined }) @IsString({ message: dtoMessageIsValidValue }) name!: string;

  @Expose() @IsOptional() @IsString({ message: dtoMessageIsValidValue }) description?: string;

  @Expose() @IsOptional() @IsDate() deadlineAt?: Date;

  @Expose() @IsOptional() @IsString({ message: dtoMessageIsValidValue }) responsibleId?: string;

  @Expose() @IsOptional() @IsString({ message: dtoMessageIsValidValue }) customerId?: string;

  @Expose() @IsOptional() @IsEnum(TicketPriorities, { message: dtoMessageIsValidValue }) priority?: TicketPriorities;

  @Expose()
  @IsOptional()
  @IsString({ message: dtoMessageIsValidValue })
  typeKey?: string;

  @Expose()
  @IsDefined({ message: dtoMessageIsDefined })
  @IsString({ message: dtoMessageIsValidValue })
  statusKey!: string;
}
