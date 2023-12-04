import { Expose } from "class-transformer";
import { IsString, IsOptional, IsBoolean } from "class-validator";
import { withDefaultValue } from "@app/kit";

import { dtoMessageIsValidValue } from "constants/dtoErrorMessage";

export class RequestUpdateCorrespondenceRevisionCommentDTO {
  @Expose() @IsOptional() @IsString({ message: dtoMessageIsValidValue }) text?: string;

  @Expose()
  @IsOptional()
  @IsBoolean({ message: dtoMessageIsValidValue })
  @withDefaultValue(false)
  isPartOfTransaction!: boolean;
}
