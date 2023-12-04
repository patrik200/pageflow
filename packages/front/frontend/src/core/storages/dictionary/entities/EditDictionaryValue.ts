import { computed, observable } from "mobx";
import { BaseEntity, makeFnTransformableObject } from "@app/kit";
import { IsString, MinLength } from "class-validator";

import { NOT_EMPTY_VALIDATION } from "core/commonValidationErrors";

import { DictionaryEntity, DictionaryValueEntity } from "core/entities/dictionary/dictionary";

export class EditDictionaryValueEntity extends BaseEntity {
  static buildFromDictionaryValueEntity(dictionary: DictionaryEntity, value: DictionaryValueEntity) {
    return makeFnTransformableObject(
      () => new EditDictionaryValueEntity(dictionary, value),
      () => ({
        key: value.key,
        value: value.value,
      }),
    );
  }

  static buildEmptyEntity(dictionary: DictionaryEntity) {
    return makeFnTransformableObject(() => new EditDictionaryValueEntity(dictionary, null));
  }

  constructor(public dictionary: DictionaryEntity, public dictionaryValue: DictionaryValueEntity | null) {
    super();
    this.initEntity();
  }

  @observable @IsString() @MinLength(1, { message: NOT_EMPTY_VALIDATION }) key = "";
  setKey = this.createSetter("key");

  @observable @IsString() @MinLength(1, { message: NOT_EMPTY_VALIDATION }) value = "";
  setValue = this.createSetter("value");

  @computed get apiCreateReady() {
    return {
      key: this.key,
      value: this.value,
    };
  }

  @computed get apiUpdateReady() {
    return {
      value: this.value,
    };
  }
}
