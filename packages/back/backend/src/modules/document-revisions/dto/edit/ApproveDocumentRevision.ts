import { Expose } from "class-transformer";
import { IsInt, IsOptional, IsString } from "class-validator";

import { dtoMessageIsValidValue } from "constants/dtoErrorMessage";

export class RequestApproveDocumentRevisionDTO {
  @Expose() @IsOptional() @IsInt({ message: dtoMessageIsValidValue }) responsibleUserFlowRowIndex?: number;

  @Expose() @IsOptional() @IsInt({ message: dtoMessageIsValidValue }) responsibleUserFlowRowUserIndex?: number;

  @Expose() @IsOptional() @IsString({ message: dtoMessageIsValidValue }) result?: string;

  @Expose() @IsOptional() @IsString({ message: dtoMessageIsValidValue }) comment?: string;
}
