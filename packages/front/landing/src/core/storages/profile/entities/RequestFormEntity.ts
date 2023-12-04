import { action, computed, observable } from "mobx";
import { BaseEntity, makeTransformableObject } from "@app/kit";
import { IsNotEmpty, IsEmail, IsBoolean, IsIn } from "class-validator";

import { EMAIL_VALIDATION, NOT_EMPTY_VALIDATION, PRIVACY_VALIDATION } from "core/commonValidationErrors";

export class RequestFormEntity extends BaseEntity {
  static buildEmpty() {
    return makeTransformableObject(RequestFormEntity);
  }

  constructor() {
    super();
    this.initEntity();
  }

  @observable successMessage = "";
  @action setSuccessMessage = (message: string) => (this.successMessage = message);

  @observable errorMessage = "";
  @action setErrorMessage = (message: string) => (this.errorMessage = message);

  @observable @IsNotEmpty({ message: NOT_EMPTY_VALIDATION }) name = "";
  setName = this.createSetter("name");

  @observable @IsEmail(undefined, { message: EMAIL_VALIDATION }) email = "";
  setEmail = this.createSetter("email");

  @observable @IsNotEmpty({ message: NOT_EMPTY_VALIDATION }) companyName = "";
  setCompanyName = this.createSetter("companyName");

  @observable @IsNotEmpty({ message: NOT_EMPTY_VALIDATION }) domain = "";
  setDomain = this.createSetter("domain");

  @observable @IsBoolean() @IsIn([true], { message: PRIVACY_VALIDATION }) privacy = false;
  setPrivacy = this.createToggle("privacy");

  @computed get apiReady() {
    return {
      name: this.name,
      email: this.email,
      companyName: this.companyName,
      domain: this.domain,
    };
  }
}
