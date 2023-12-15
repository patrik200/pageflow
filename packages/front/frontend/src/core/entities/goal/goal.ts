import { arrayOfEntitiesDecoder, BaseEntity, withDefaultValue } from "@app/kit";
import { Expose, Type } from "class-transformer";
import { IsDefined, IsOptional, IsString, ValidateNested } from "class-validator";

import { TimepointEntity } from "./timepoint";

export class GoalEntity extends BaseEntity {
  constructor() {
    super();
    this.initEntity();
  }

  @Expose() @IsDefined() @IsString() id!: string;

  @Expose() @IsDefined() @IsString() @withDefaultValue("") name!: string;

  @Expose() @IsOptional() @IsString() @withDefaultValue("") description!: string;

  @Expose() @IsDefined() @Type(() => TimepointEntity) @ValidateNested({ each: true }) timepoints!: TimepointEntity[];
}

export const arrayOfGoalsDecoder = arrayOfEntitiesDecoder(GoalEntity);
