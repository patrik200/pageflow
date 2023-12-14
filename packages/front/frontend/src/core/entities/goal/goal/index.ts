import { arrayOfEntitiesDecoder, BaseEntity, withDefaultValue } from "@app/kit";
import { Expose, Type } from "class-transformer";
import { IsBoolean, IsDefined, IsOptional, IsString, ValidateNested } from "class-validator";
import { observable } from "mobx";

import { TimepointEntity } from "../timepoint";

export class GoalEntity extends BaseEntity {
  constructor() {
    super();
    this.initEntity();
  }

  @Expose() @IsDefined() @IsString() id!: string;

  @Expose() @IsOptional() @IsString() @withDefaultValue("") name!: string;

  @Expose() @IsOptional() @IsString() @withDefaultValue("") description!: string;

  @Expose() @IsDefined() @Type(() => TimepointEntity) @ValidateNested({ each: true }) timepoints!: TimepointEntity[];

  @observable @Expose() @IsDefined() @IsBoolean() @withDefaultValue(false) implemented!: boolean;
  setImplemented = this.createSetter("implemented");
}

export const arrayOfGoalsDecoder = arrayOfEntitiesDecoder(GoalEntity);
