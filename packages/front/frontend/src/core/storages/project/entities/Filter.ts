import { BaseEntity, createSortingForFieldGetter, createSortingSetter, makeTransformableObject } from "@app/kit";
import { observable, computed } from "mobx";
import type { Sorting } from "@app/kit";
import { ProjectSortingFields } from "@app/shared-enums";

import { filterChangeSubscriber } from "core/entities/_utils/filterChangeSubscriber";

export class ProjectsListFiltersEntity extends BaseEntity {
  static buildEmpty() {
    return makeTransformableObject(ProjectsListFiltersEntity);
  }

  constructor() {
    super();
    this.initEntity();
  }

  @observable search = "";
  setSearch = this.createSetter("search");

  @observable sorting: Sorting<ProjectSortingFields> = undefined;
  getSortingForField = createSortingForFieldGetter<ProjectSortingFields>(this);
  setSorting = createSortingSetter<ProjectSortingFields>(this);

  @observable showArchived = false;
  setShowArchived = this.createSetter("showArchived");

  @observable responsible: string | null = null;
  setResponsible = this.createSetter("responsible");

  subscribeOnChange(callback: () => void) {
    return filterChangeSubscriber(
      { search: ["search"], checkboxes: ["showArchived"], selects: ["responsible"], sorting: "sorting" },
      this,
      callback,
    );
  }

  @computed get apiReady() {
    return {
      search: this.search,
      sorting: this.sorting,
      showArchived: this.showArchived,
      responsibleUser: this.responsible,
    };
  }
}
