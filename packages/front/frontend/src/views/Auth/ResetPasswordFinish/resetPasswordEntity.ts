import { observable } from "mobx";
import { IsString, MinLength } from "class-validator";
import { BaseEntity, makeTransformableObject, MatchValidation } from "@app/kit";

import { NOT_EMPTY_VALIDATION, PASSWORDS_SHOULD_BE_EQUALS } from "core/commonValidationErrors";

export class ResetPasswordEntity extends BaseEntity {
  static buildEmpty() {
    return makeTransformableObject(ResetPasswordEntity);
  }

  constructor() {
    super();
    this.initEntity();
  }

  @observable
  @IsString()
  @MinLength(1, { message: NOT_EMPTY_VALIDATION })
  password = "";
  setPassword = this.createSetter("password");

  @observable
  @IsString()
  @MatchValidation("password", { message: PASSWORDS_SHOULD_BE_EQUALS })
  repeatPassword = "";
  setRepeatPassword = this.createSetter("repeatPassword");
}
