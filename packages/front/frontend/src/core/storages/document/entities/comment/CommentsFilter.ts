import { BaseEntity, makeTransformableObject } from "@app/kit";
import { observable, computed } from "mobx";

export class CommentsFilterEntity extends BaseEntity {
  static buildEmpty() {
    return makeTransformableObject(CommentsFilterEntity);
  }

  constructor() {
    super();
    this.initEntity();
  }

  @observable showUnresolved = false;
  setShowUnresolved = this.createSetter("showUnresolved");

  subscribeOnChange(callback: () => void) {
    return this.registerCustomOnMultipleFieldChangeCallback(callback, ["showUnresolved"], 200);
  }

  @computed get apiReady() {
    return {
      showUnresolved: this.showUnresolved,
    };
  }
}
