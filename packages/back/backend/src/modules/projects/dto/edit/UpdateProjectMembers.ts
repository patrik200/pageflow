import { Expose } from "class-transformer";
import { IsString, IsDefined } from "class-validator";

import { dtoMessageIsValidValue, dtoMessageIsDefined } from "constants/dtoErrorMessage";

export class RequestUpdateProjectMembersDTO {
  @Expose()
  @IsDefined({ message: dtoMessageIsDefined })
  @IsString({ each: true, message: dtoMessageIsValidValue })
  members!: string[];
}
