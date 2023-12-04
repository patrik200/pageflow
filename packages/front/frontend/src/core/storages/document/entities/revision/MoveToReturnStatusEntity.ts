import { computed, observable } from "mobx";
import { BaseEntity, makeTransformableObject } from "@app/kit";
import { IsDefined } from "class-validator";

import { NOT_EMPTY_VALIDATION } from "core/commonValidationErrors";

export class MoveToReturnStatusEntity extends BaseEntity {
  static buildEmpty() {
    return makeTransformableObject(MoveToReturnStatusEntity);
  }

  constructor() {
    super();
    this.initEntity();
  }

  @observable @IsDefined({ message: NOT_EMPTY_VALIDATION }) code: string | null = null;
  setCode = this.createSetter("code");

  @observable message = "";
  setMessage = this.createSetter("message");

  @computed get apiReady() {
    return {
      returnCodeKey: this.code,
      message: this.message,
    };
  }
}
