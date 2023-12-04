import { arrayOfEntitiesDecoder, BaseEntity, withDefaultValue } from "@app/kit";
import { Expose } from "class-transformer";
import { IsBoolean, IsDefined, IsOptional, IsString } from "class-validator";
import { observable } from "mobx";

export class GoalEntity extends BaseEntity {
  constructor() {
    super();
    this.initEntity();
  }

  @Expose() @IsDefined() @IsString() id!: string;

  @Expose() @IsOptional() @IsString() @withDefaultValue("") name!: string;

  @Expose() @IsOptional() @IsString() @withDefaultValue("") description!: string;

  @observable @Expose() @IsDefined() @IsBoolean() @withDefaultValue(false) implemented!: boolean;
  setImplemented = this.createSetter("implemented");
}

export const arrayOfGoalDecoder = arrayOfEntitiesDecoder(GoalEntity);
