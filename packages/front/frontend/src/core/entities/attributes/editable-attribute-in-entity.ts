import { BaseEntity, makeTransformableObject } from "@app/kit";
import { IsDefined } from "class-validator";
import { computed, observable } from "mobx";

import { NOT_EMPTY_VALIDATION } from "core/commonValidationErrors";

import { AttributeInEntityEntity } from "./attribute-in-entity";

export class EditableAttributeInEntityEntity extends BaseEntity {
  static buildEmpty() {
    return makeTransformableObject(EditableAttributeInEntityEntity);
  }

  constructor() {
    super();
    this.initEntity();
    this.registerOnBuildCallback(() => {
      this.registerCustomOnFieldChangeCallback(() => this.setValue(null), "type", 0);
    });
  }

  @observable @IsDefined({ message: NOT_EMPTY_VALIDATION }) type: string | null = null;
  setType = this.createSetter("type");

  @observable @IsDefined({ message: NOT_EMPTY_VALIDATION }) value: string | null = null;
  setValue = this.createSetter("value");

  subscribeOnTypeChange(callback: (type: string) => void) {
    return this.registerCustomOnFieldChangeCallback(() => this.type && callback(this.type), "type", 0);
  }

  @computed get toAttributeInEntityEntity() {
    return AttributeInEntityEntity.buildFromEditableAttributeInEntity(this);
  }
}
