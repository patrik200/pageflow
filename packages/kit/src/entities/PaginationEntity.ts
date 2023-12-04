import { Expose } from "class-transformer";
import { computed, observable } from "mobx";

import { BaseEntity } from "./BaseEntity";

import { makeTransformableObject } from "libs/makeTransformableObject";

export interface PaginationQueryInterface {
  page: number;
  perPage: number;
}

export class PaginationEntity extends BaseEntity implements PaginationQueryInterface {
  static build(options: PaginationQueryInterface & { totalCount: number }) {
    return makeTransformableObject(PaginationEntity, () => options);
  }

  constructor() {
    super();
    this.initEntity();
  }

  @observable @Expose() totalCount!: number;
  @observable @Expose() page!: number;
  @observable @Expose() perPage!: number;

  @computed
  get totalPages() {
    return Math.ceil(this.totalCount / this.perPage);
  }

  @computed
  get canGetMore() {
    return this.page * this.perPage < this.totalCount;
  }
}

export interface PaginatedFindResult<Entity> {
  items: Entity[];
  pagination: PaginationEntity;
}
