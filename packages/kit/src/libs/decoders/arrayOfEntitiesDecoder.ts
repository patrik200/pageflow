import { Constructable } from "typedi";
import { observable } from "mobx";
import { ValidateNested } from "class-validator";
import { Expose, Type } from "class-transformer";

import { BaseEntity } from "entities/BaseEntity";

export function arrayOfEntitiesDecoder<ENTITY extends BaseEntity>(
  Entity: Constructable<ENTITY>,
): Constructable<BaseEntity & { array: ENTITY[] }> {
  class ArrayOfEntities extends BaseEntity {
    __schemaTransform = (array: ENTITY[]) => ({ array });

    constructor() {
      super();
      this.initEntity();
      this.registerOnBuildCallback(() => this.array.forEach((el) => el.__runOnBuildCallbacks()));
    }

    @observable
    @Expose()
    @ValidateNested({ each: true })
    @Type(() => Entity)
    array!: ENTITY[];
  }

  return ArrayOfEntities;
}
