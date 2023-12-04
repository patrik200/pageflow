import { computed, observable } from "mobx";
import type { Sorting } from "@app/kit";
import { BaseEntity, createSortingForFieldGetter, createSortingSetter, makeFnTransformableObject } from "@app/kit";
import { CorrespondenceRevisionSortingFields } from "@app/shared-enums";

import { filterChangeSubscriber } from "core/entities/_utils/filterChangeSubscriber";

export class CorrespondenceRevisionFilterEntity extends BaseEntity {
  static buildEmpty(correspondenceId: string) {
    return makeFnTransformableObject(() => new CorrespondenceRevisionFilterEntity(correspondenceId));
  }

  constructor(public correspondenceId: string) {
    super();
    this.initEntity();
  }

  @observable showArchived = false;
  setShowArchived = this.createSetter("showArchived");

  @observable sorting: Sorting<CorrespondenceRevisionSortingFields> = undefined;
  getSortingForField = createSortingForFieldGetter<CorrespondenceRevisionSortingFields>(this);
  setSorting = createSortingSetter<CorrespondenceRevisionSortingFields>(this);

  subscribeOnChange(callback: () => void) {
    return filterChangeSubscriber({ checkboxes: ["showArchived"], selects: ["sorting"] }, this, callback);
  }

  @computed get apiReady() {
    return {
      url: {
        correspondenceId: this.correspondenceId,
      },
      body: {
        showArchived: this.showArchived,
        sorting: this.sorting,
      },
    };
  }
}
