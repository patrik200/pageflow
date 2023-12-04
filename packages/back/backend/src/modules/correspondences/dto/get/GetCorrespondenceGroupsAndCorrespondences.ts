import { IsBooleanConverter, IsSorting } from "@app/kit";
import { Expose, Type } from "class-transformer";
import { IsDefined, IsOptional, IsString, ValidateNested } from "class-validator";
import { CorrespondenceSortingFields } from "@app/shared-enums";

import { dtoMessageIsDefined, dtoMessageIsValidValue } from "constants/dtoErrorMessage";

import type { CorrespondenceSorting } from "../../types";

export class RequestGetCorrespondenceGroupsAndCorrespondencesAttributesDTO {
  @Expose()
  @IsDefined({ message: dtoMessageIsDefined })
  @IsString({ message: dtoMessageIsValidValue })
  attributeTypeKey!: string;

  @Expose()
  @IsDefined({ message: dtoMessageIsDefined })
  @IsString({ message: dtoMessageIsValidValue })
  value!: string;
}

export class RequestGetCorrespondenceGroupsAndCorrespondencesDTO {
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
  @IsOptional()
  @IsString({ message: dtoMessageIsValidValue })
  search?: string;

  @Expose()
  @IsOptional()
  @IsString({ message: dtoMessageIsValidValue })
  author?: string;

  @Expose()
  @IsBooleanConverter()
  searchInRevisionAttachments!: boolean;

  @Expose()
  @IsBooleanConverter()
  showArchived!: boolean;

  @Expose()
  @IsSorting(Object.values(CorrespondenceSortingFields))
  sorting!: CorrespondenceSorting;

  @Expose()
  @IsOptional()
  @Type(() => RequestGetCorrespondenceGroupsAndCorrespondencesAttributesDTO)
  @ValidateNested({ each: true })
  attributes?: RequestGetCorrespondenceGroupsAndCorrespondencesAttributesDTO[];
}
