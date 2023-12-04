import { arrayOfEntitiesDecoder, BaseEntity, IsDate, withDefaultValue } from "@app/kit";
import { Expose, Type } from "class-transformer";
import { IsBoolean, IsDefined, IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";
import { DateTime } from "luxon";
import { DateMode, IntlDate } from "@worksolutions/utils";
import { computed, observable } from "mobx";
import { DocumentRevisionApprovingStatuses, DocumentRevisionStatus } from "@app/shared-enums";

import { UserEntity } from "core/entities/user";

export class DocumentRevisionEntity extends BaseEntity {
  constructor() {
    super();
    this.initEntity();
  }

  protected intlDate!: IntlDate;

  configure(intlDate: IntlDate) {
    this.intlDate = intlDate;
  }

  @Expose() @IsDefined() @IsString() id!: string;

  @Expose() @IsDefined() @IsString() number!: string;

  @Expose() @IsDefined() @Type(() => UserEntity) @ValidateNested() author!: UserEntity;

  @Expose() @IsDefined() @IsEnum(DocumentRevisionStatus) status!: DocumentRevisionStatus;

  @Expose() @IsDefined() @IsDate() createdAt!: Date;

  @Expose() @IsDefined() @IsDate() updatedAt!: Date;

  @Expose() @IsOptional() @IsDate() approvingDeadline!: Date | null;

  @computed get approvingDeadlineNextDay() {
    if (!this.approvingDeadline) return null;
    return DateTime.fromJSDate(this.approvingDeadline).plus({ days: 1 }).toJSDate();
  }

  @computed get approvingDeadlineRemainingDays() {
    if (!this.approvingDeadline) return null;
    if (!DocumentRevisionApprovingStatuses.includes(this.status)) return null;
    return Math.ceil(DateTime.fromJSDate(this.approvingDeadline).diffNow("days").days);
  }

  @Expose() @IsDefined() @IsBoolean() canProlongApprovingDeadline!: boolean;

  @Expose() @IsDefined() @IsBoolean() canRunProlongApprovingDeadline!: boolean;

  @Expose()
  @IsOptional()
  @IsString()
  @withDefaultValue("")
  returnMessage!: string;

  @observable @Expose() @IsDefined() @IsBoolean() favourite!: boolean;
  setFavourite = this.createSetter("favourite");

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

  @Expose() @IsDefined() @IsBoolean() canMoveToInitialStatusForRestore!: boolean;

  @Expose() @IsDefined() @IsBoolean() canMoveToArchiveStatus!: boolean;

  @Expose() @IsDefined() @IsBoolean() canMoveToApprovedStatusByResponsibleUserFlowReviewer!: boolean;

  @computed get viewCreatedAt() {
    return this.intlDate.formatDate(DateTime.fromJSDate(this.createdAt), DateMode.DATE_WITH_STRING_MONTH);
  }

  @computed get viewUpdatedAt() {
    return this.intlDate.formatDate(DateTime.fromJSDate(this.createdAt), DateMode.DATE_WITH_STRING_MONTH);
  }

  @computed get archived() {
    return [DocumentRevisionStatus.ARCHIVE, DocumentRevisionStatus.ARCHIVED_AUTOMATICALLY_RESTORE_ARCHIVE].includes(
      this.status,
    );
  }
}

export const arrayOfDocumentRevisionEntitiesDecoder = arrayOfEntitiesDecoder(DocumentRevisionEntity);
