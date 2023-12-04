import { observable } from "mobx";
import { BaseEntity, makeTransformableObject } from "@app/kit";
import { IsUrl } from "class-validator";

import { URL_VALIDATION } from "core/commonValidationErrors";

import { ClientEntity } from "core/entities/client";

export class EditUrlEntity extends BaseEntity {
  static buildEmpty() {
    return makeTransformableObject(EditUrlEntity);
  }

  constructor(public client: ClientEntity) {
    super();
    this.initEntity();
  }

  @observable
  @IsUrl({ require_protocol: true }, { message: URL_VALIDATION })
  url = "";
  setUrl = this.createSetter("url");
}
