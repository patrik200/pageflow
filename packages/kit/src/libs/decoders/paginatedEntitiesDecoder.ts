import { Constructable } from "typedi";
import { observable } from "mobx";
import { ValidateNested } from "class-validator";
import { Expose, Type } from "class-transformer";

import { BaseEntity } from "entities/BaseEntity";
import { PaginationEntity } from "entities/PaginationEntity";

import { makeTransformableObject } from "libs/makeTransformableObject";

export type PaginatedEntities<ENTITY extends BaseEntity> = BaseEntity & {
  items: ENTITY[];
  pagination: PaginationEntity;
};

export function paginatedOfEntitiesDecoder<ENTITY extends BaseEntity>(
  Entity: Constructable<ENTITY>,
): Constructable<PaginatedEntities<ENTITY>> {
  class PaginatedEntitiesClass extends BaseEntity {
    constructor() {
      super();
      this.initEntity();
      this.registerOnBuildCallback(() => this.items.forEach((item) => item.__runOnBuildCallbacks()));
      this.registerOnBuildCallback(() => this.pagination.__runOnBuildCallbacks());
    }

    @observable @Expose() @ValidateNested({ each: true }) @Type(() => Entity) items!: ENTITY[];

    @observable @Expose() @ValidateNested() @Type(() => PaginationEntity) pagination!: PaginationEntity;
  }

  return PaginatedEntitiesClass;
}

export const emptyPaginatedEntities = makeTransformableObject(paginatedOfEntitiesDecoder(BaseEntity), () => ({
  items: [],
  pagination: PaginationEntity.build({ page: 1, perPage: 1, totalCount: 0 }),
}));
