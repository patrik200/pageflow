import { IsOptional, IsString } from "class-validator";
import { Expose } from "class-transformer";

import { dtoMessageIsValidValue } from "constants/dtoErrorMessage";

export class RequestUpdateContractorDTO {
  @Expose() @IsOptional() @IsString({ message: dtoMessageIsValidValue }) name?: string;
}
