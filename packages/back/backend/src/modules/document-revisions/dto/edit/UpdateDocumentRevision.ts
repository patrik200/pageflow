import { Expose } from "class-transformer";
import { IsBoolean, IsOptional, IsString } from "class-validator";
import { IsDate } from "@app/kit";

import { dtoMessageIsValidValue } from "constants/dtoErrorMessage";

export class RequestUpdateDocumentRevisionDTO {
  @Expose() @IsOptional() @IsString({ message: dtoMessageIsValidValue }) number?: string;

  @Expose() @IsOptional() @IsString({ message: dtoMessageIsValidValue }) responsibleUserId?: string | null;

  @Expose() @IsOptional() @IsString({ message: dtoMessageIsValidValue }) responsibleUserFlowId?: string | null;

  @Expose() @IsOptional() @IsDate() approvingDeadline?: Date | null;

  @Expose() @IsOptional() @IsBoolean({ message: dtoMessageIsValidValue }) canProlongApprovingDeadline?: boolean;
}
