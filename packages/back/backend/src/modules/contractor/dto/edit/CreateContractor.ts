import { IsDefined, IsString } from "class-validator";
import { Expose } from "class-transformer";

import { dtoMessageIsDefined, dtoMessageIsValidValue } from "constants/dtoErrorMessage";

export class RequestCreateContractorDTO {
  @Expose() @IsDefined({ message: dtoMessageIsDefined }) @IsString({ message: dtoMessageIsValidValue }) name!: string;
}
