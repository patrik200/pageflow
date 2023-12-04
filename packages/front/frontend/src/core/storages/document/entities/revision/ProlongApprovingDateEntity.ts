import { computed, observable } from "mobx";
import { BaseEntity, makeFnTransformableObject } from "@app/kit";
import { IsDefined } from "class-validator";

import { NOT_EMPTY_VALIDATION } from "core/commonValidationErrors";

export class ProlongApprovingDateEntity extends BaseEntity {
  static buildEmpty(revisionId: string) {
    return makeFnTransformableObject(() => new ProlongApprovingDateEntity(revisionId));
  }

  constructor(public revisionId: string) {
    super();
    this.initEntity();
  }

  @observable @IsDefined({ message: NOT_EMPTY_VALIDATION }) approvingDeadline: Date | null = null;
  setApprovingDeadline = this.createSetter("approvingDeadline");

  @computed get apiReady() {
    return {
      approvingDeadline: this.approvingDeadline,
    };
  }
}
