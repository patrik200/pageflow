import { Constructable } from "typedi";
import { IsOptional, ValidateNested } from "class-validator";
import { Expose, Type } from "class-transformer";
import { isNil } from "@worksolutions/utils";

import { BaseEntity } from "entities/BaseEntity";

export function nullableEntityDecoder<ENTITY extends BaseEntity>(
  Entity: Constructable<ENTITY>,
): Constructable<BaseEntity & { nullableValue: ENTITY | null }> {
  class NullableEntity extends BaseEntity {
    __schemaTransform = (entity: any) => ({ nullableValue: isNil(entity) || entity === "" ? null : entity });

    constructor() {
      super();
      this.initEntity();
      this.registerOnBuildCallback(() => this.nullableValue?.__runOnBuildCallbacks());
    }

    @Expose()
    @ValidateNested()
    @Type(() => Entity)
    @IsOptional()
    nullableValue: ENTITY | null = null;
  }

  return NullableEntity as any;
}
