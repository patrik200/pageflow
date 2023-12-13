import { IsDate, withDefaultValue } from "@app/kit";
import { Expose } from "class-transformer";
import { IsDefined, IsString, IsOptional } from "class-validator";
import { computed, observable } from "mobx";


export class TimePointEntity {
  @Expose() @IsDefined() @IsString() id!: string;

  @Expose() @IsDefined() @IsString() name!: string;

  @Expose() @IsDefined() @IsString() description!: string;

  @observable @Expose() @IsDate() @IsOptional()  startDateFact!: Date | null;
  
  @observable @Expose() @IsDate() @IsOptional() startDatePlan!: Date | null;
}
