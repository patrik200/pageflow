import { IsBoolean, IsDefined, IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";
import { Expose, Type } from "class-transformer";
import { IsDate, withDefaultValue } from "@app/kit";
import { DocumentRevisionStatus, DocumentStatus } from "@app/shared-enums";

import { ResponseProfileDTO } from "modules/users";
import { ResponseMinimalProjectDTO } from "modules/projects/dto/get/Project";
import { ResponseUserFlowDTO } from "modules/userFlow/dto/get/UserFlow";
import { ResponsePermissionDTO } from "modules/permissions";
import { ResponseAttributeValueForEntityDTO } from "modules/attributes/dto/get-for-entity/Attributes";

import { ResponseMinimalDocumentGroupDTO } from "./DocumentGroup";

export class ResponseDocumentParentGroupDTO extends ResponseMinimalDocumentGroupDTO {
  @Expose()
  @IsDefined()
  @Type(() => ResponseMinimalDocumentGroupDTO)
  @ValidateNested({ each: true })
  groupsPath!: ResponseMinimalDocumentGroupDTO[];
}

export class ResponseDocumentRootGroupDTO {
  @Expose({ name: "project", toPlainOnly: true })
  @IsDefined()
  @Type(() => ResponseMinimalProjectDTO)
  @ValidateNested()
  parentProject!: ResponseMinimalProjectDTO;
}

export class ResponseDocumentTypeDTO {
  @Expose() @IsDefined() key!: string;
}

export class ResponseMinimalDocumentDTO {
  @Expose() @IsDefined() @IsString() id!: string;

  @Expose() @IsDefined() @IsString() name!: string;
}

export class ResponseDocumentDTO extends ResponseMinimalDocumentDTO {
  @Expose() @IsDefined() @IsOptional() description?: string;

  @Expose() @IsDefined() @IsOptional() remarks?: string;

  @Expose() @IsDefined() @IsDate() createdAt!: Date;

  @Expose() @IsDefined() @IsDate() updatedAt!: Date;

  @Expose() @IsOptional() @IsDate() startDatePlan?: Date;

  @Expose() @IsOptional() @IsDate() startDateForecast?: Date;

  @Expose() @IsOptional() @IsDate() startDateFact?: Date;

  @Expose() @IsOptional() @IsDate() endDatePlan?: Date;

  @Expose() @IsOptional() @IsDate() endDateForecast?: Date;

  @Expose() @IsOptional() @IsDate() endDateFact?: Date;

  @Expose() @IsOptional() @Type(() => ResponseProfileDTO) @ValidateNested() author?: ResponseProfileDTO;

  @Expose() @IsOptional() @Type(() => ResponseProfileDTO) @ValidateNested() responsibleUser!: ResponseProfileDTO | null;

  @Expose()
  @IsOptional()
  @Type(() => ResponseUserFlowDTO)
  @ValidateNested()
  responsibleUserFlow!: ResponseUserFlowDTO | null;

  @Expose() @IsDefined() @IsBoolean() @withDefaultValue(false) favourite!: boolean;

  @Expose() @IsDefined() @IsBoolean() @withDefaultValue(false) canArchive!: boolean;

  @Expose() @IsDefined() @IsBoolean() @withDefaultValue(false) canActive!: boolean;

  @Expose() @IsDefined() @IsEnum(DocumentStatus) status!: DocumentStatus;

  @Expose() @IsDefined() @IsBoolean() isPrivate!: boolean;

  @Expose() @IsOptional() @Type(() => ResponseDocumentTypeDTO) @ValidateNested() type?: ResponseDocumentTypeDTO;

  contractor!: null;

  @Expose()
  @IsOptional()
  @IsEnum(DocumentRevisionStatus)
  lastRevisionStatus?: DocumentRevisionStatus | null;

  @Expose()
  @IsOptional()
  @Type(() => ResponseDocumentParentGroupDTO)
  @ValidateNested()
  parentGroup!: ResponseDocumentParentGroupDTO | null;

  @Expose()
  @IsOptional()
  @Type(() => ResponseDocumentRootGroupDTO)
  @ValidateNested()
  rootGroup!: ResponseDocumentRootGroupDTO | null;

  @Expose()
  @IsOptional()
  @Type(() => ResponsePermissionDTO)
  @ValidateNested({ each: true })
  permissions?: ResponsePermissionDTO[];

  @Expose()
  @IsOptional()
  @Type(() => ResponseAttributeValueForEntityDTO)
  @ValidateNested({ each: true })
  attributeValues?: ResponseAttributeValueForEntityDTO[];
}

export class ResponseDocumentsListDTO {
  @Expose() @IsDefined() @Type(() => ResponseDocumentDTO) @ValidateNested({ each: true }) list!: ResponseDocumentDTO[];
}
