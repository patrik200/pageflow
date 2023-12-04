import { IsOptional, IsString } from "class-validator";
import { Expose } from "class-transformer";

import { dtoMessageIsValidValue } from "constants/dtoErrorMessage";

export class RequestUpdateClientDTO {
  @Expose() @IsOptional() @IsString({ message: dtoMessageIsValidValue }) name?: string;
}
