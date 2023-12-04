import { arrayOfEntitiesDecoder, BaseEntity, IsDate } from "@app/kit";
import { Expose, Type } from "class-transformer";
import { IsBoolean, IsDefined, IsEnum, IsString, ValidateNested } from "class-validator";
import { DateTime } from "luxon";
import { DateMode, IntlDate } from "@worksolutions/utils";
import { computed, observable } from "mobx";
import { CorrespondenceRevisionStatus } from "@app/shared-enums";

import { UserEntity } from "../user";

export class CorrespondenceRevisionEntity extends BaseEntity {
  constructor() {
    super();
    this.initEntity();
  }

  private intlDate!: IntlDate;

  configure(intlDate: IntlDate) {
    this.intlDate = intlDate;
  }

  @Expose() @IsDefined() @IsString() id!: string;

  @Expose() @IsDefined() @IsString() number!: string;

  @Expose() @IsDefined() @Type(() => UserEntity) @ValidateNested() author!: UserEntity;

  @observable @Expose() @IsDefined() @IsEnum(CorrespondenceRevisionStatus) status!: CorrespondenceRevisionStatus;
  setStatus = this.createSetter("status");

  @Expose() @IsDefined() @IsDate() createdAt!: Date;

  @Expose() @IsDefined() @IsDate() updatedAt!: Date;

  @observable @Expose() @IsDefined() @IsBoolean() canArchiveByStatus!: boolean;
  setCanArchiveByStatus = this.createSetter("canArchiveByStatus");

  @observable @Expose() @IsDefined() @IsBoolean() canActiveByStatus!: boolean;
  setCanActiveByStatus = this.createSetter("canActiveByStatus");

  @observable @Expose() @IsDefined() @IsBoolean() favourite!: boolean;
  setFavourite = this.createSetter("favourite");

  @computed get viewCreatedAt() {
    return this.intlDate.formatDate(DateTime.fromJSDate(this.createdAt), DateMode.DATE_WITH_STRING_MONTH);
  }

  @computed get viewUpdatedAt() {
    return this.intlDate.formatDate(DateTime.fromJSDate(this.createdAt), DateMode.DATE_WITH_STRING_MONTH);
  }

  @computed get archived() {
    return [
      CorrespondenceRevisionStatus.ARCHIVE,
      CorrespondenceRevisionStatus.ARCHIVED_AUTOMATICALLY_RESTORE_ARCHIVE,
    ].includes(this.status);
  }
}

export const arrayOfCorrespondenceRevisionEntitiesDecoder = arrayOfEntitiesDecoder(CorrespondenceRevisionEntity);
