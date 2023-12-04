import { Expose } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

import { dtoMessageIsValidValue } from "constants/dtoErrorMessage";

export class RequestReturnDocumentRevisionDTO {
  @Expose() @IsOptional() @IsString({ message: dtoMessageIsValidValue }) message?: string;

  @Expose() @IsOptional() @IsString({ message: dtoMessageIsValidValue }) returnCodeKey!: string;
}
