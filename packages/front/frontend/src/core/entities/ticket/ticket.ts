import { DateTime } from "luxon";
import { computed, observable } from "mobx";
import { Expose, Type } from "class-transformer";
import { TicketPriorities } from "@app/shared-enums";
import { DateMode, IntlDate } from "@worksolutions/utils";
import { BaseEntity, IsDate, arrayOfEntitiesDecoder, paginatedOfEntitiesDecoder, withDefaultValue } from "@app/kit";
import { IsDefined, IsNumber, IsOptional, IsEnum, IsString, ValidateNested } from "class-validator";
import { BadgeColorVariants } from "@app/ui-kit";

import { UserEntity } from "../user";
import { FileEntity } from "../file";

const ONE_DAY_TIME = 86400000;
const SEVEN_DAYS_TIME = ONE_DAY_TIME * 7;

export class TicketStatusEntity extends BaseEntity {
  constructor() {
    super();
    this.initEntity();
  }

  @observable @Expose() @IsDefined() @IsString() key!: string;
}

export class TicketTypeEntity extends BaseEntity {
  constructor() {
    super();
    this.initEntity();
  }

  @observable @Expose() @IsDefined() @IsString() key!: string;
}

export class TicketEntity extends BaseEntity {
  constructor() {
    super();
    this.initEntity();
  }

  private intlDate!: IntlDate;

  configure(intlDate: IntlDate) {
    this.intlDate = intlDate;
  }

  @observable @Expose() @IsDefined() @IsString() id!: string;

  @observable @Expose() @IsDefined() @IsString() name!: string;

  @observable @Expose() @IsDefined() @IsNumber() sort!: number;

  @observable @Expose() @IsDefined() @IsEnum(TicketPriorities) priority!: TicketPriorities;

  @observable
  @Expose()
  @IsOptional()
  @Type(() => TicketTypeEntity)
  @ValidateNested()
  @withDefaultValue(null)
  type!: TicketTypeEntity | null;

  @observable @Expose() @IsDefined() @Type(() => TicketStatusEntity) @ValidateNested() status!: TicketStatusEntity;

  @observable @Expose() @IsOptional() @IsDate() @withDefaultValue(null) deadlineAt!: Date | null;

  @observable @Expose() @IsDefined() @IsDate() createdAt!: Date;

  @observable @Expose() @IsDefined() @IsDate() updatedAt!: Date;

  @observable
  @Expose()
  @Type(() => UserEntity)
  @ValidateNested()
  @IsOptional()
  @withDefaultValue(null)
  customer!: UserEntity | null;

  @observable
  @Expose()
  @Type(() => UserEntity)
  @ValidateNested()
  @IsOptional()
  @withDefaultValue(null)
  responsible!: UserEntity | null;

  @observable
  @Expose()
  @IsDefined()
  @Type(() => FileEntity)
  @ValidateNested({ each: true })
  files!: FileEntity[];

  @computed get viewDeadline() {
    if (!this.deadlineAt) return null;
    return this.intlDate.formatDate(DateTime.fromJSDate(this.deadlineAt), DateMode.DATE);
  }

  @computed get viewCreatedAt() {
    return this.intlDate.formatDate(DateTime.fromJSDate(this.createdAt), DateMode.DATE_WITH_STRING_MONTH);
  }

  @computed get deadlineBadgeVariant() {
    if (!this.deadlineAt) return null;

    const currentDate = +new Date();
    const deadlineDate = +new Date(this.deadlineAt);

    if (isNaN(deadlineDate)) return null;
    const dateDifference = deadlineDate - currentDate;

    if (dateDifference < ONE_DAY_TIME) return BadgeColorVariants.ALARM;
    return dateDifference < SEVEN_DAYS_TIME ? BadgeColorVariants.WARNING : BadgeColorVariants.INFO;
  }

  @computed get priorityBadgeVariant() {
    if (this.priority === TicketPriorities.HIGH) return BadgeColorVariants.ALARM;
    if (this.priority === TicketPriorities.MEDIUM) return BadgeColorVariants.WARNING;
    return BadgeColorVariants.INFO;
  }
}

export const paginatedTicketEntitiesDecoder = paginatedOfEntitiesDecoder(TicketEntity);
export const arrayOfTicketEntitiesDecoder = arrayOfEntitiesDecoder(TicketEntity);
