import { observable } from "mobx";
import { IsEmail, IsNotEmpty } from "class-validator";
import { Expose } from "class-transformer";
import { BaseEntity, makeTransformableObject } from "@app/kit";

import { EMAIL_VALIDATION, NOT_EMPTY_VALIDATION } from "core/commonValidationErrors";

export class AuthorizationEntity extends BaseEntity {
  static buildEmpty() {
    return makeTransformableObject(AuthorizationEntity);
  }

  constructor() {
    super();
    this.initEntity();
  }

  @observable @Expose() @IsEmail({}, { message: EMAIL_VALIDATION }) email = "";
  setEmail = this.createSetter("email");

  @observable @Expose() @IsNotEmpty({ message: NOT_EMPTY_VALIDATION }) password = "";
  setPassword = this.createSetter("password");
}
