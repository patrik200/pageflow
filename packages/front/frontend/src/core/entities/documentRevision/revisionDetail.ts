import { Expose, Type } from "class-transformer";
import { IsBoolean, IsDefined, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { IsDate, withDefaultValue } from "@app/kit";
import { computed, observable } from "mobx";
import { DocumentRevisionStatus, UserFlowMode } from "@app/shared-enums";
import { DateMode, nbspString } from "@worksolutions/utils";
import { DateTime } from "luxon";

import { FileEntity } from "core/entities/file";
import { DocumentEntity } from "core/entities/document/document";
import { UserEntity } from "core/entities/user";
import { DictionaryValueEntity } from "core/entities/dictionary/dictionary";
import { ChangeFeedEventEntity } from "core/entities/change-feed";

import { DocumentRevisionEntity } from "./revision";

export class DocumentRevisionResponsibleUserEntity {
  @Expose() @IsDefined() @IsBoolean() approved!: boolean;

  @Expose() @IsOptional() @IsString() comment!: string | null;

  @Expose() @IsDefined() @Type(() => UserEntity) @ValidateNested() user!: UserEntity;
}

export class DocumentRevisionResponsibleUserFlowRowUserEntity {
  @Expose() @IsDefined() @IsString() id!: string;

  @Expose() @IsDefined() @IsString() description!: string;

  @Expose() @IsDefined() @IsBoolean() canApprove!: boolean;

  @Expose() @IsDefined() @IsBoolean() approved!: boolean;

  @Expose() @IsOptional() @IsString() result?: string;

  @Expose() @IsDefined() @Type(() => FileEntity) @ValidateNested({ each: true }) files!: FileEntity[];

  @Expose() @IsDefined() @Type(() => UserEntity) @ValidateNested() user!: UserEntity;
}

export class DocumentRevisionResponsibleUserFlowRowEntity {
  @Expose() @IsDefined() @IsBoolean() completed!: boolean;

  @Expose() @IsDefined() @IsEnum(UserFlowMode) mode!: UserFlowMode;

  @Expose() @IsDefined() @IsString() name!: string;

  @Expose()
  @IsDefined()
  @Type(() => DocumentRevisionResponsibleUserFlowRowUserEntity)
  @ValidateNested({ each: true })
  users!: DocumentRevisionResponsibleUserFlowRowUserEntity[];

  @computed get progress() {
    switch (this.mode) {
      case UserFlowMode.OR:
        return this.users.some((user) => user.approved) ? 1 : 0;
      case UserFlowMode.AND:
        return this.users.filter((user) => user.approved).length / this.users.length;
      default:
        throw TypeError(`Unexpected enum UserFlowMode value: ${this.mode}`);
    }
  }
}

export class DocumentRevisionResponsibleUserFlowReviewerEntity {
  @Expose() @IsDefined() @IsBoolean() approved!: boolean;

  @Expose() @IsOptional() @IsString() comment!: string | null;

  @Expose()
  @IsDefined()
  @Type(() => UserEntity)
  @ValidateNested()
  user!: UserEntity;
}

export class DocumentRevisionResponsibleUserFlowEntity {
  @Expose() @IsDefined() @IsString() name!: string;

  @Expose() @IsOptional() @IsDate() deadlineDate!: Date | null;

  @Expose() @IsOptional() @IsBoolean() deadlineDaysIncludeWeekends!: boolean | null;

  @Expose() @IsOptional() @IsDate() approvedDate!: Date | null;

  @Expose()
  @IsDefined()
  @Type(() => DocumentRevisionResponsibleUserFlowRowEntity)
  @ValidateNested({ each: true })
  rows!: DocumentRevisionResponsibleUserFlowRowEntity[];

  @Expose()
  @IsOptional()
  @Type(() => DocumentRevisionResponsibleUserFlowReviewerEntity)
  @ValidateNested()
  reviewer?: DocumentRevisionResponsibleUserFlowReviewerEntity;

  @computed get allRowsCompleted() {
    const rowsCompleted = !this.rows.some((row) => !row.completed);
    if (!this.reviewer) return rowsCompleted;
    return this.reviewer.approved && rowsCompleted;
  }

  @computed get progress() {
    let progressSum = this.rows.map((row) => row.progress).reduce((sum, progress) => sum + progress);
    let itemsCount = this.rows.length;
    if (this.reviewer) {
      if (this.reviewer.approved) progressSum += 1;
      itemsCount += 1;
    }

    return progressSum / itemsCount;
  }

  @computed get showReviewerActions() {
    if (!this.reviewer) return false;
    if (this.reviewer.approved) return false;
    return !this.rows.some((row) => !row.completed);
  }
}

export class DocumentRevisionReturnCodeEntity {
  @Expose() @IsDefined() @IsString() key!: string;
}

export class ResponseDocumentRevisionReturnCountEntity {
  @Expose()
  @IsDefined()
  @Type(() => DocumentRevisionReturnCodeEntity)
  @ValidateNested()
  returnCode!: DocumentRevisionReturnCodeEntity;

  @Expose() @IsDefined() @IsNumber() count!: number;
}

export class DocumentRevisionDetailEntity extends DocumentRevisionEntity {
  constructor() {
    super();
    this.initEntity();
  }

  @Expose() @IsDefined() @IsNumber() reviewRequestedCount!: number;

  @Expose() @IsDefined() @IsDate() statusChangeDate!: Date;

  @Expose()
  @IsDefined()
  @Type(() => ResponseDocumentRevisionReturnCountEntity)
  @ValidateNested({ each: true })
  returnCounts!: ResponseDocumentRevisionReturnCountEntity[];

  @Expose()
  @IsOptional()
  @Type(() => UserEntity)
  @ValidateNested()
  @withDefaultValue(null)
  statusChangeAuthor!: UserEntity | null;

  @Expose() @IsDefined() @Type(() => FileEntity) @ValidateNested({ each: true }) files!: FileEntity[];

  @Expose()
  @IsDefined()
  @Type(() => DocumentEntity)
  @ValidateNested()
  @withDefaultValue(null)
  document!: DocumentEntity;

  @Expose()
  @IsOptional()
  @Type(() => DocumentRevisionResponsibleUserEntity)
  @ValidateNested()
  @withDefaultValue(null)
  responsibleUserApproving!: DocumentRevisionResponsibleUserEntity | null;

  @Expose()
  @IsOptional()
  @Type(() => DocumentRevisionResponsibleUserFlowEntity)
  @ValidateNested()
  @withDefaultValue(null)
  responsibleUserFlowApproving!: DocumentRevisionResponsibleUserFlowEntity | null;

  static getViewReturnCounts(
    returnCodeDictionaryValues: DictionaryValueEntity[],
    returnCounts: ResponseDocumentRevisionReturnCountEntity[],
  ) {
    if (returnCounts.length === 0) return undefined;

    const returnCodesObject = Object.fromEntries(returnCodeDictionaryValues.map((value) => [value.key, value.value]));

    return returnCounts
      .map((returnCount) => {
        const returnCode = returnCodesObject[returnCount.returnCode.key]!;
        return `${returnCode}${nbspString}-${nbspString}${returnCount.count}`;
      })
      .join("\n");
  }

  @computed get approvedDateString() {
    if (![DocumentRevisionStatus.APPROVED, DocumentRevisionStatus.APPROVED_WITH_COMMENT].includes(this.status))
      return null;
    return this.intlDate.formatDate(DateTime.fromJSDate(this.statusChangeDate), DateMode.DATE_TIME_WITH_STRING_MONTH);
  }

  @computed get responsibleUser() {
    return this.responsibleUserApproving;
  }

  @computed get responsibleUserFlow() {
    return this.responsibleUserFlowApproving;
  }

  @observable changeFeedEvents: ChangeFeedEventEntity[] = [];
}
