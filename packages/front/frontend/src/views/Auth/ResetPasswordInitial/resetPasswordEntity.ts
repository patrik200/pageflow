import { observable } from "mobx";
import { IsEmail } from "class-validator";
import { Expose } from "class-transformer";
import { BaseEntity, makeTransformableObject } from "@app/kit";

import { EMAIL_VALIDATION } from "core/commonValidationErrors";

export class ResetPasswordEntity extends BaseEntity {
  static buildEmpty() {
    return makeTransformableObject(ResetPasswordEntity);
  }

  constructor() {
    super();
    this.initEntity();
  }

  @observable @Expose() @IsEmail({}, { message: EMAIL_VALIDATION }) email = "";
  setEmail = this.createSetter("email");
}
