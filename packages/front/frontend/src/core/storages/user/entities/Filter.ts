import type { Sorting } from "@app/kit";
import { BaseEntity, createSortingForFieldGetter, createSortingSetter, makeTransformableObject } from "@app/kit";
import { computed, observable } from "mobx";
import { UserSortingFields } from "@app/shared-enums";

import { filterChangeSubscriber } from "core/entities/_utils/filterChangeSubscriber";

export class UsersListFiltersEntity extends BaseEntity {
  static buildEmpty() {
    return makeTransformableObject(UsersListFiltersEntity);
  }

  constructor() {
    super();
    this.initEntity();
  }

  @observable search = "";
  setSearch = this.createSetter("search");

  @observable searchWithDeleted = false;
  setSearchWithDeleted = this.createSetter("searchWithDeleted");

  @observable sorting: Sorting<UserSortingFields> = undefined;
  getSortingForField = createSortingForFieldGetter<UserSortingFields>(this);
  setSorting = createSortingSetter<UserSortingFields>(this);

  subscribeOnChange(callback: () => void) {
    return filterChangeSubscriber(
      { search: ["search"], checkboxes: ["searchWithDeleted"], selects: ["sorting"] },
      this,
      callback,
    );
  }

  @computed get apiReady() {
    return { search: this.search, searchWithDeleted: this.searchWithDeleted, sorting: this.sorting };
  }
}
