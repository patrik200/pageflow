import { Expose } from "class-transformer";
import { IsBoolean, IsDefined, IsOptional, IsString } from "class-validator";
import { IsDate } from "@app/kit";

import { dtoMessageIsDefined, dtoMessageIsValidValue } from "constants/dtoErrorMessage";

export class RequestCreateDocumentRevisionDTO {
  @Expose() @IsDefined({ message: dtoMessageIsDefined }) @IsString({ message: dtoMessageIsValidValue }) number!: string;

  @Expose() @IsOptional() @IsString({ message: dtoMessageIsValidValue }) responsibleUserId?: string;

  @Expose() @IsOptional() @IsString({ message: dtoMessageIsValidValue }) responsibleUserFlowId?: string;

  @Expose() @IsOptional() @IsDate() approvingDeadline?: Date;

  @Expose() @IsOptional() @IsBoolean({ message: dtoMessageIsValidValue }) canProlongApprovingDeadline?: boolean;
}
