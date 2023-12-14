import { BaseEntity, IsDate } from "@app/kit";
import { Expose } from "class-transformer";
import { IsDefined, IsString, IsOptional, IsNumber } from "class-validator";
import { computed, observable } from "mobx";
import { DateMode, IntlDate } from "@worksolutions/utils";
import { DateTime } from "luxon";

export class TimepointEntity extends BaseEntity {
  constructor() {
    super();
    this.initEntity();
  }

  private intlDate!: IntlDate;

  configure(intlDate: IntlDate) {
    this.intlDate = intlDate;
  }

  @computed get viewDatePlan() {
    return this.intlDate.formatDate(DateTime.fromJSDate(this.datePlan), DateMode.DATE_WITH_STRING_MONTH);
  }

  @Expose() @IsDefined() @IsString() id!: string;

  @Expose() @IsDefined() @IsString() name!: string;

  @Expose() @IsOptional() @IsString() description!: string;

  @Expose() @IsDate() @IsDefined() datePlan!: Date;

  @Expose() @IsDefined() @IsNumber() remainingDays!: number;
}
