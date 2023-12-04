import { IsBooleanConverter } from "@app/kit";
import { Expose } from "class-transformer";
import { IsDefined, IsOptional, IsString } from "class-validator";

import { dtoMessageIsDefined, dtoMessageIsValidValue } from "constants/dtoErrorMessage";

export class RequestCreateDocumentGroupDTO {
  @Expose()
  @IsDefined({ message: dtoMessageIsDefined })
  @IsString({ message: dtoMessageIsValidValue })
  name!: string;

  @Expose()
  @IsOptional()
  @IsString({ message: dtoMessageIsValidValue })
  description?: string;

  @Expose()
  @IsOptional()
  @IsString({ message: dtoMessageIsValidValue })
  parentGroupId?: string;

  @Expose()
  @IsOptional()
  @IsString({ message: dtoMessageIsValidValue })
  projectId?: string;

  @Expose()
  @IsOptional()
  @IsBooleanConverter()
  isPrivate!: boolean;
}
