import { ContainsStorageFilesDTO } from "@app/back-kit";
import { CorrespondenceRevisionSortingFields, CorrespondenceRevisionStatus } from "@app/shared-enums";
import { Expose, Type } from "class-transformer";
import { IsBoolean, IsDefined, IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";
import { IsBooleanConverter, IsDate, IsSorting, withDefaultValue } from "@app/kit";

import { ResponseProfileDTO } from "modules/users";
import { ResponseCorrespondenceDTO } from "modules/correspondences/dto/get/Correspondence";

import { CorrespondenceRevisionSorting } from "../../types";

export class ResponseCorrespondenceRevisionDTO {
  @Expose() @IsDefined() @IsString() id!: string;

  @Expose() @IsDefined() @IsString() number!: string;

  @Expose() @IsDefined() @IsEnum(CorrespondenceRevisionStatus) status!: CorrespondenceRevisionStatus;

  @Expose() @IsDefined() @Type(() => ResponseProfileDTO) @ValidateNested() author!: ResponseProfileDTO;

  @Expose() @IsDefined() @IsDate() createdAt!: Date;

  @Expose() @IsDefined() @IsDate() updatedAt!: Date;

  @Expose() @IsDefined() @IsBoolean() @withDefaultValue(false) favourite!: boolean;

  @Expose() @IsDefined() @IsBoolean() canArchiveByStatus!: boolean;

  @Expose() @IsDefined() @IsBoolean() canActiveByStatus!: boolean;
}

export class ResponseCorrespondenceRevisionDetailDTO extends ResponseCorrespondenceRevisionDTO {
  @Expose()
  @IsDefined()
  @Type(() => ContainsStorageFilesDTO)
  @ValidateNested({ each: true })
  files!: ContainsStorageFilesDTO[];

  @Expose()
  @IsDefined()
  @Type(() => ResponseCorrespondenceDTO)
  @ValidateNested()
  correspondence!: ResponseCorrespondenceDTO;
}

export class ResponseCorrespondenceRevisionsListDTO {
  @Expose()
  @IsDefined()
  @Type(() => ResponseCorrespondenceRevisionDTO)
  @ValidateNested({ each: true })
  list!: ResponseCorrespondenceRevisionDTO[];
}

export class RequestGetCorrespondenceRevisionsDTO {
  @Expose() @IsOptional() @IsBooleanConverter() showArchived!: boolean;

  @Expose()
  @IsSorting(Object.values(CorrespondenceRevisionSortingFields))
  sorting!: CorrespondenceRevisionSorting;
}
