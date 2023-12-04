import { IsBooleanConverter } from "@app/kit";
import { Expose, Type } from "class-transformer";
import { IsString, IsOptional, IsDefined, ValidateNested } from "class-validator";

import { dtoMessageIsValidValue, dtoMessageIsDefined } from "constants/dtoErrorMessage";

import { RequestAttributeForEntityDTO } from "modules/attributes/dto/get-for-entity/Attributes";

export class RequestCreateCorrespondenceDTO {
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
  @IsString({ message: dtoMessageIsValidValue })
  contractorId?: string;

  @Expose()
  @IsOptional()
  @IsBooleanConverter()
  isPrivate!: boolean;

  @Expose()
  @IsOptional()
  @Type(() => RequestAttributeForEntityDTO)
  @ValidateNested({ each: true })
  attributes?: RequestAttributeForEntityDTO[];
}
