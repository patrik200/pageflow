import { BaseEntity, IsDate } from "@app/kit";
import { Expose } from "class-transformer";
import { IsDefined, IsString, IsOptional } from "class-validator";
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

  @computed get viewStartDatePlan() {
    return this.intlDate.formatDate(DateTime.fromJSDate(this.startDatePlan), DateMode.DATE_WITH_STRING_MONTH);
  }

  @computed get viewStartDateFact() {
    return this.startDateFact ? this.intlDate.formatDate(DateTime.fromJSDate(this.startDateFact), DateMode.DATE_WITH_STRING_MONTH) : null;
  }

  @Expose() @IsDefined() @IsString() id!: string;

  @Expose() @IsDefined() @IsString() name!: string;

  @Expose() @IsDefined() @IsString() description!: string;

  @Expose()  @IsOptional() @IsDate() startDateFact!: Date | null;
  
  @Expose() @IsDate() @IsDefined() startDatePlan!: Date;
}
