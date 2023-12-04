import { computed, observable } from "mobx";
import type { Sorting } from "@app/kit";
import { BaseEntity, createSortingForFieldGetter, createSortingSetter, makeFnTransformableObject } from "@app/kit";
import { DocumentRevisionSortingFields } from "@app/shared-enums";

import { filterChangeSubscriber } from "core/entities/_utils/filterChangeSubscriber";

export class DocumentRevisionFilterEntity extends BaseEntity {
  static buildEmpty(documentId: string) {
    return makeFnTransformableObject(() => new DocumentRevisionFilterEntity(documentId));
  }

  constructor(public documentId: string) {
    super();
    this.initEntity();
  }

  @observable showArchived = false;
  setShowArchived = this.createSetter("showArchived");

  @observable sorting: Sorting<DocumentRevisionSortingFields> = undefined;
  getSortingForField = createSortingForFieldGetter<DocumentRevisionSortingFields>(this);
  setSorting = createSortingSetter<DocumentRevisionSortingFields>(this);

  subscribeOnChange(callback: () => void) {
    return filterChangeSubscriber(
      {
        checkboxes: ["showArchived"],
        selects: ["sorting"],
      },
      this,
      callback,
    );
  }

  @computed get apiReady() {
    return {
      url: {
        documentId: this.documentId,
      },
      body: {
        showArchived: this.showArchived,
        sorting: this.sorting,
      },
    };
  }
}
