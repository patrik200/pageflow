import { computed, observable } from "mobx";
import { arrayOfEntitiesDecoder, BaseEntity, IsDate, paginatedOfEntitiesDecoder, withDefaultValue } from "@app/kit";
import { Expose, Type } from "class-transformer";
import { IsBoolean, IsDefined, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { DateMode, IntlDate } from "@worksolutions/utils";
import { DateTime } from "luxon";
import { ProjectsStatus } from "@app/shared-enums";

import { UserEntity } from "core/entities/user";
import { FileEntity } from "core/entities/file";

export class MinimalProjectEntity extends BaseEntity {
  constructor() {
    super();
    this.initEntity();
  }

  @observable @Expose() @IsDefined() @IsString() id!: string;

  @observable @Expose() @IsDefined() @IsString() name!: string;
}

export class ProjectEntity extends MinimalProjectEntity {
  constructor() {
    super();
    this.initEntity();
  }

  protected intlDate!: IntlDate;
  protected currentUser!: UserEntity;

  configure(intlDate: IntlDate, currentUser: UserEntity) {
    this.intlDate = intlDate;
    this.currentUser = currentUser;
  }

  @observable @Expose() @IsEnum(ProjectsStatus) @IsDefined() status!: ProjectsStatus;
  setStatus = this.createSetter("status");

  @observable @Expose() @IsBoolean() canMoveToCompletedStatus!: boolean;
  setCanMoveToCompletedStatus = this.createSetter("canMoveToCompletedStatus");

  @observable @Expose() @IsOptional() @IsString() @withDefaultValue("") description!: string;

  @observable @Expose() @IsDefined() @IsNumber() updateCount!: number;

  @observable @Expose() @IsDefined() @Type(() => UserEntity) @ValidateNested() author!: UserEntity;

  @observable @Expose() @IsDefined() @IsNumber() activeTicketsCount!: number;

  @observable
  @Expose()
  @Type(() => UserEntity)
  @ValidateNested()
  @IsOptional()
  @withDefaultValue(null)
  responsible!: UserEntity | null;

  @observable @Expose() @IsDate() @IsOptional() @withDefaultValue(null) startDatePlan!: Date | null;

  @observable @Expose() @IsDate() @IsOptional() @withDefaultValue(null) startDateForecast!: Date | null;

  @observable @Expose() @IsDate() @IsOptional() @withDefaultValue(null) startDateFact!: Date | null;

  @observable @Expose() @IsDate() @IsOptional() @withDefaultValue(null) endDatePlan!: Date | null;

  @observable @Expose() @IsDate() @IsOptional() @withDefaultValue(null) endDateForecast!: Date | null;

  @observable @Expose() @IsDate() @IsOptional() @withDefaultValue(null) endDateFact!: Date | null;

  @observable @Expose() @IsOptional() @IsNumber() notifyInDays!: number | null;

  @observable @Expose() @IsDefined() @IsDate() createdAt!: Date;

  @observable @Expose() @IsOptional() @Type(() => FileEntity) @withDefaultValue(null) preview!: FileEntity | null;

  @observable @Expose() @IsDefined() @IsBoolean() favourite!: boolean;
  setFavourite = this.createSetter("favourite");

  @observable @Expose() @IsDefined() @IsBoolean() isPrivate!: boolean;

  @computed get viewStartDatePlan() {
    if (!this.startDatePlan) return null;
    return this.intlDate.formatDate(DateTime.fromJSDate(this.startDatePlan), DateMode.DAY_WITH_STRING_SHORT_MONTH);
  }

  @computed get viewEndDatePlan() {
    if (!this.endDatePlan) return null;
    return this.intlDate.formatDate(DateTime.fromJSDate(this.endDatePlan), DateMode.DAY_WITH_STRING_SHORT_MONTH);
  }

  @computed get viewEndDatePlanRemaining() {
    if (this.status !== ProjectsStatus.IN_PROGRESS) return null;
    if (!this.endDatePlan) return null;
    return Math.ceil(DateTime.fromJSDate(this.endDatePlan).diffNow("days").days);
  }

  @computed get viewEndDatePlanRemainingWarning() {
    if (this.viewEndDatePlanRemaining === null) return null;
    if (this.notifyInDays === null) return null;
    return this.viewEndDatePlanRemaining <= this.notifyInDays ? this.viewEndDatePlanRemaining : null;
  }

  @computed get viewStartDateForecast() {
    if (!this.startDateForecast) return null;
    return this.intlDate.formatDate(DateTime.fromJSDate(this.startDateForecast), DateMode.DAY_WITH_STRING_SHORT_MONTH);
  }

  @computed get viewEndDateForecast() {
    if (!this.endDateForecast) return null;
    return this.intlDate.formatDate(DateTime.fromJSDate(this.endDateForecast), DateMode.DAY_WITH_STRING_SHORT_MONTH);
  }

  @computed get viewEndDateForecastRemaining() {
    if (this.status !== ProjectsStatus.IN_PROGRESS) return null;
    if (!this.endDateForecast) return null;
    return Math.ceil(DateTime.fromJSDate(this.endDateForecast).diffNow("days").days);
  }

  @computed get viewStartDateFact() {
    if (!this.startDateFact) return null;
    return this.intlDate.formatDate(DateTime.fromJSDate(this.startDateFact), DateMode.DAY_WITH_STRING_SHORT_MONTH);
  }

  @computed get viewEndDateFact() {
    if (!this.endDateFact) return null;
    return this.intlDate.formatDate(DateTime.fromJSDate(this.endDateFact), DateMode.DAY_WITH_STRING_SHORT_MONTH);
  }

  @computed get viewEndDateFactRemaining() {
    if (this.status !== ProjectsStatus.IN_PROGRESS) return null;
    if (!this.endDateFact) return null;
    return Math.ceil(DateTime.fromJSDate(this.endDateFact).diffNow("days").days);
  }

  @computed get completed() {
    return this.status === ProjectsStatus.COMPLETED;
  }

  @computed get archived() {
    return this.status === ProjectsStatus.ARCHIVE;
  }
}

export const paginatedProjectsDecoder = paginatedOfEntitiesDecoder(ProjectEntity);
export const arrayOfProjectEntitiesDecoder = arrayOfEntitiesDecoder(ProjectEntity);
