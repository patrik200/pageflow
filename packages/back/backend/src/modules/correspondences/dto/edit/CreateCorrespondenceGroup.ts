import { IsBooleanConverter } from "@app/kit";
import { Expose } from "class-transformer";
import { IsString, IsDefined, IsOptional } from "class-validator";

import { dtoMessageIsValidValue, dtoMessageIsDefined } from "constants/dtoErrorMessage";

export class RequestCreateCorrespondenceGroupDTO {
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
  @IsString({ message: dtoMessageIsValidValue })
  documentId?: string;

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
  @IsBooleanConverter()
  isPrivate!: boolean;
}
