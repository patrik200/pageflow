import { computed, observable } from "mobx";
import { BaseEntity, makeFnTransformableObject } from "@app/kit";
import { IsString, MinLength } from "class-validator";

import { NOT_EMPTY_VALIDATION } from "core/commonValidationErrors";

import { ClientEntity } from "core/entities/client";

export class EditClientEntity extends BaseEntity {
  static buildFromClientEntity(entity: ClientEntity) {
    return makeFnTransformableObject(
      () => new EditClientEntity(entity),
      () => ({
        name: entity.name,
      }),
    );
  }

  constructor(public client: ClientEntity) {
    super();
    this.initEntity();
  }

  @observable @IsString() @MinLength(1, { message: NOT_EMPTY_VALIDATION }) name!: string;
  setName = this.createSetter("name");

  @computed get apiUpdateReady() {
    return {
      name: this.name,
    };
  }
}
