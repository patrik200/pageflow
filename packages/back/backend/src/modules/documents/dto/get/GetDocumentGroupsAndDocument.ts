import { IsDefined, IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";
import { IsBooleanConverter, IsSorting } from "@app/kit";
import { DocumentRevisionStatus, DocumentSortingFields } from "@app/shared-enums";
import { Expose, Type } from "class-transformer";

import { dtoMessageIsDefined, dtoMessageIsValidValue } from "constants/dtoErrorMessage";

import type { DocumentSorting } from "../../types";

export class RequestGetDocumentGroupsAndDocumentsAttributeDTO {
  @Expose()
  @IsDefined({ message: dtoMessageIsDefined })
  @IsString({ message: dtoMessageIsValidValue })
  attributeTypeKey!: string;

  @Expose()
  @IsDefined({ message: dtoMessageIsDefined })
  @IsString({ message: dtoMessageIsValidValue })
  value!: string;
}

export class RequestGetDocumentGroupsAndDocumentsDTO {
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
  search?: string;

  @Expose()
  @IsOptional()
  @IsString({ message: dtoMessageIsValidValue })
  author?: string;

  @Expose()
  @IsOptional()
  @IsString({ message: dtoMessageIsValidValue })
  responsibleUser?: string;

  @Expose()
  @IsBooleanConverter()
  searchInRevisionAttachments!: boolean;

  @Expose()
  @IsOptional()
  @IsEnum(DocumentRevisionStatus, { message: dtoMessageIsValidValue })
  lastRevisionStatus?: DocumentRevisionStatus;

  @Expose()
  @IsBooleanConverter()
  showArchived!: boolean;

  @Expose()
  @IsOptional()
  @IsString({ message: dtoMessageIsValidValue })
  typeKey?: string;

  @Expose()
  @IsSorting(Object.values(DocumentSortingFields))
  sorting!: DocumentSorting;

  @Expose()
  @IsBooleanConverter()
  acrossAllProjects!: boolean;

  @Expose()
  @IsOptional()
  @Type(() => RequestGetDocumentGroupsAndDocumentsAttributeDTO)
  @ValidateNested({ each: true })
  attributes?: RequestGetDocumentGroupsAndDocumentsAttributeDTO[];
}
