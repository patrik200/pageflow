import { arrayOfEntitiesDecoder, BaseEntity, withDefaultValue } from "@app/kit";
import { Expose, Type } from "class-transformer";
import { IsBoolean, IsDefined, IsOptional, IsString, ValidateNested } from "class-validator";
import { observable } from "mobx";

import { TimePoint } from "../timepoint";

export class GoalEntity extends BaseEntity {
  constructor() {
    super();
    this.initEntity();
  }

  @Expose() @IsDefined() @IsString() id!: string;

  @Expose() @IsOptional() @IsString() @withDefaultValue("") name!: string;

  @Expose() @IsOptional() @IsString() @withDefaultValue("") description!: string;

  @Expose() @IsDefined() @Type(() => TimePoint) @ValidateNested({ each: true }) timepoints!: TimePoint[];

  @observable @Expose() @IsDefined() @IsBoolean() @withDefaultValue(false) implemented!: boolean;
  setImplemented = this.createSetter("implemented");
}

export const arrayOfGoalDecoder = arrayOfEntitiesDecoder(GoalEntity);
