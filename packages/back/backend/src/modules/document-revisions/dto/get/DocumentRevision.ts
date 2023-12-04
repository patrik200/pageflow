import { IsBoolean, IsDefined, IsEnum, IsOptional, IsString, IsNumber, ValidateNested } from "class-validator";
import { Expose, Type } from "class-transformer";
import { DocumentRevisionStatus, UserFlowMode, DocumentRevisionSortingFields } from "@app/shared-enums";
import { IsBooleanConverter, IsSorting, IsDate, withDefaultValue } from "@app/kit";
import { ContainsStorageFilesDTO } from "@app/back-kit";

import { ResponseProfileDTO } from "modules/users";
import { ResponseDocumentDTO } from "modules/documents/dto/get/Document";
import { DocumentRevisionSorting } from "modules/document-revisions/types";

export class ResponseDocumentRevisionDTO {
  @Expose() @IsDefined() @IsString() id!: string;

  @Expose() @IsDefined() @IsString() number!: string;

  @Expose() @IsDefined() @IsEnum(DocumentRevisionStatus) status!: DocumentRevisionStatus;

  @Expose() @IsDefined() @Type(() => ResponseProfileDTO) @ValidateNested() author!: ResponseProfileDTO;

  @Expose() @IsDefined() @IsDate() createdAt!: Date;

  @Expose() @IsDefined() @IsDate() updatedAt!: Date;

  @Expose() @IsDefined() @IsBoolean() @withDefaultValue(false) favourite!: boolean;

  @Expose() @IsOptional() @IsDate() approvingDeadline!: Date | null;

  @Expose() @IsDefined() @IsBoolean() canProlongApprovingDeadline!: boolean;

  @Expose() @IsDefined() @IsBoolean() canRunProlongApprovingDeadline!: boolean;

  @Expose() @IsDefined() @IsBoolean() canUploadFiles!: boolean;

  @Expose() @IsDefined() @IsBoolean() canEditComments!: boolean;

  @Expose() @IsDefined() @IsBoolean() canMoveToReviewStatus!: boolean;

  @Expose() @IsDefined() @IsBoolean() canMoveToInitialStatusForCancelReview!: boolean;

  @Expose() @IsDefined() @IsBoolean() canMoveToInitialStatusForFromRevoked!: boolean;

  @Expose() @IsDefined() @IsBoolean() canMoveToApprovedStatusByResponsibleUser!: boolean;

  @Expose() @IsDefined() @IsBoolean() moveToApprovedStatusByResponsibleUserStoppedByUnresolvedComment!: boolean;

  @Expose() @IsDefined() @IsBoolean() moveToApprovedStatusByResponsibleUserFlowStoppedByUnresolvedComment!: boolean;

  @Expose() @IsDefined() @IsBoolean() moveToApprovedStatusByResponsibleUserFlowStoppedByNotApproved!: boolean;

  @Expose() @IsDefined() @IsBoolean() canMoveToReturnStatus!: boolean;

  @Expose() @IsDefined() @IsBoolean() canMoveToRevokedStatus!: boolean;

  @Expose() @IsDefined() @IsBoolean() canMoveToArchiveStatus!: boolean;

  @Expose() @IsDefined() @IsBoolean() canMoveToInitialStatusForRestore!: boolean;

  @Expose() @IsDefined() @IsBoolean() canMoveToApprovedStatusByResponsibleUserFlowReviewer!: boolean;
}

export class ResponseDocumentRevisionResponsibleUserDTO {
  @Expose() @IsDefined() @IsBoolean() approved!: boolean;

  @Expose() @IsOptional() @IsString() comment!: string | null;

  @Expose() @IsDefined() @Type(() => ResponseProfileDTO) @ValidateNested() user!: ResponseProfileDTO;
}

export class ResponseDocumentRevisionResponsibleUserFlowRowUserDTO {
  @Expose() @IsDefined() @IsString() id!: string;

  @Expose() @IsDefined() @IsString() description!: string;

  @Expose() @IsDefined() @IsBoolean() canApprove!: boolean;

  @Expose() @IsDefined() @IsBoolean() approved!: boolean;

  @Expose() @IsOptional() @IsString() result?: string;

  @Expose()
  @IsDefined()
  @Type(() => ContainsStorageFilesDTO)
  @ValidateNested({ each: true })
  files!: ContainsStorageFilesDTO[];

  @Expose() @IsDefined() @Type(() => ResponseProfileDTO) @ValidateNested() user!: ResponseProfileDTO;
}

export class ResponseDocumentRevisionResponsibleUserFlowRowDTO {
  @Expose() @IsDefined() @IsBoolean() completed!: boolean;

  @Expose() @IsDefined() @IsEnum(UserFlowMode) mode!: UserFlowMode;

  @Expose() @IsDefined() @IsString() name!: string;

  @Expose()
  @IsDefined()
  @Type(() => ResponseDocumentRevisionResponsibleUserFlowRowUserDTO)
  @ValidateNested({ each: true })
  users!: ResponseDocumentRevisionResponsibleUserFlowRowUserDTO[];
}

export class ResponseDocumentRevisionResponsibleUserFlowReviewerDTO {
  @Expose() @IsDefined() @IsBoolean() approved!: boolean;

  @Expose() @IsOptional() @IsString() comment!: string | null;

  @Expose()
  @IsDefined()
  @Type(() => ResponseProfileDTO)
  @ValidateNested()
  user!: ResponseProfileDTO;
}

export class ResponseDocumentRevisionResponsibleUserFlowDTO {
  @Expose() @IsDefined() @IsBoolean() deadlineDaysIncludeWeekends!: boolean;

  @Expose() @IsOptional() @IsNumber() deadlineDaysAmount!: number | null;

  @Expose() @IsDefined() @IsString() name!: string;

  @Expose() @IsOptional() @IsDate() deadlineDate!: Date | null;

  @Expose() @IsOptional() @IsDate() approvedDate!: Date | null;

  @Expose()
  @IsOptional()
  @Type(() => ResponseDocumentRevisionResponsibleUserFlowReviewerDTO)
  @ValidateNested()
  reviewer?: ResponseDocumentRevisionResponsibleUserFlowReviewerDTO;

  @Expose()
  @IsDefined()
  @Type(() => ResponseDocumentRevisionResponsibleUserFlowRowDTO)
  @ValidateNested({ each: true })
  rows!: ResponseDocumentRevisionResponsibleUserFlowRowDTO[];
}

export class ResponseDocumentRevisionReturnCodeDTO {
  @Expose() @IsDefined() key!: string;
}

export class ResponseDocumentRevisionReturnCountDTO {
  @Expose()
  @IsDefined()
  @Type(() => ResponseDocumentRevisionReturnCodeDTO)
  @ValidateNested()
  returnCode!: ResponseDocumentRevisionReturnCodeDTO;

  @Expose() @IsDefined() @IsNumber() count!: number;
}

export class ResponseDocumentRevisionDetailDTO extends ResponseDocumentRevisionDTO {
  @Expose() @IsOptional() @IsString() returnMessage?: string;

  @Expose() @IsDefined() @IsNumber() reviewRequestedCount!: number;

  @Expose() @IsDefined() @IsDate() statusChangeDate!: Date;

  @Expose()
  @IsDefined()
  @Type(() => ResponseDocumentRevisionReturnCountDTO)
  @ValidateNested({ each: true })
  returnCounts!: ResponseDocumentRevisionReturnCountDTO[];

  @Expose()
  @IsOptional()
  @Type(() => ResponseProfileDTO)
  @ValidateNested()
  @withDefaultValue(null)
  statusChangeAuthor!: ResponseProfileDTO | null;

  @Expose()
  @IsDefined()
  @Type(() => ContainsStorageFilesDTO)
  @ValidateNested({ each: true })
  files!: ContainsStorageFilesDTO[];

  @Expose()
  @IsDefined()
  @Type(() => ResponseDocumentDTO)
  @ValidateNested()
  document!: ResponseDocumentDTO;

  @Expose()
  @IsOptional()
  @Type(() => ResponseDocumentRevisionResponsibleUserDTO)
  @ValidateNested()
  @withDefaultValue(null)
  responsibleUserApproving!: ResponseDocumentRevisionResponsibleUserDTO | null;

  @Expose()
  @IsOptional()
  @Type(() => ResponseDocumentRevisionResponsibleUserFlowDTO)
  @ValidateNested()
  @withDefaultValue(null)
  responsibleUserFlowApproving!: ResponseDocumentRevisionResponsibleUserFlowDTO | null;
}

export class ResponseDocumentRevisionsListDTO {
  @Expose()
  @IsDefined()
  @Type(() => ResponseDocumentRevisionDTO)
  @ValidateNested({ each: true })
  list!: ResponseDocumentRevisionDTO[];
}

export class RequestDocumentRevisionDTO {
  @Expose() @IsOptional() @IsBooleanConverter() showArchived!: boolean;
  @Expose()
  @IsSorting(Object.values(DocumentRevisionSortingFields))
  sorting!: DocumentRevisionSorting;
}
