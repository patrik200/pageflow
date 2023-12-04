import { Expose, Type } from "class-transformer";
import { IsBoolean, IsDefined, IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";
import { IsDate, withDefaultValue } from "@app/kit";
import { CorrespondenceStatus } from "@app/shared-enums";

import { ResponseProfileDTO } from "modules/users";
import { ResponseMinimalProjectDTO } from "modules/projects/dto/get/Project";
import { ResponseMinimalDocumentDTO } from "modules/documents/dto/get/Document";
import { ResponsePermissionDTO } from "modules/permissions";

import { ResponseMinimalCorrespondenceGroupDTO } from "./CorrespondenceGroup";
import { ResponseAttributeValueForEntityDTO } from "../../../attributes/dto/get-for-entity/Attributes";

export class ResponseCorrespondenceParentGroupDTO extends ResponseMinimalCorrespondenceGroupDTO {
  @Expose()
  @IsDefined()
  @Type(() => ResponseMinimalCorrespondenceGroupDTO)
  @ValidateNested({ each: true })
  groupsPath!: ResponseMinimalCorrespondenceGroupDTO[];
}

export class ResponseCorrespondenceRootGroupDTO {
  @Expose({ name: "project", toPlainOnly: true })
  @IsOptional()
  @Type(() => ResponseMinimalProjectDTO)
  @ValidateNested()
  parentProject?: ResponseMinimalProjectDTO;

  @Expose({ name: "document", toPlainOnly: true })
  @IsOptional()
  @Type(() => ResponseMinimalDocumentDTO)
  @ValidateNested()
  parentDocument?: ResponseMinimalDocumentDTO;
}

export class ResponseCorrespondenceDTO {
  @Expose() @IsDefined() @IsString() id!: string;

  @Expose() @IsDefined() @IsString() name!: string;

  @Expose() @IsOptional() @IsString() description?: string;

  contractor!: null;

  @Expose() @IsDefined() @Type(() => ResponseProfileDTO) @ValidateNested() author!: ResponseProfileDTO;

  @Expose() @IsDefined() @IsEnum(CorrespondenceStatus) status!: CorrespondenceStatus;

  @Expose() @IsDefined() @IsBoolean() isPrivate!: boolean;

  @Expose() @IsDefined() @IsDate() createdAt!: Date;

  @Expose() @IsDefined() @IsDate() updatedAt!: Date;

  @Expose() @IsDefined() @IsBoolean() @withDefaultValue(false) favourite!: boolean;

  @Expose() @IsDefined() @IsBoolean() @withDefaultValue(false) canArchive!: boolean;

  @Expose() @IsDefined() @IsBoolean() @withDefaultValue(false) canActive!: boolean;

  @Expose()
  @IsOptional()
  @Type(() => ResponseCorrespondenceParentGroupDTO)
  @ValidateNested()
  parentGroup!: ResponseCorrespondenceParentGroupDTO | null;

  @Expose()
  @IsOptional()
  @Type(() => ResponseCorrespondenceRootGroupDTO)
  @ValidateNested()
  rootGroup!: ResponseCorrespondenceRootGroupDTO | null;

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

export class ResponseCorrespondencesListDTO {
  @Expose()
  @IsDefined()
  @Type(() => ResponseCorrespondenceDTO)
  @ValidateNested({ each: true })
  list!: ResponseCorrespondenceDTO[];
}
