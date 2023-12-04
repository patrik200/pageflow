import { computed, observable } from "mobx";
import { BaseEntity, makeFnTransformableObject } from "@app/kit";
import { IsEmail, IsEnum, IsString, MinLength } from "class-validator";
import { UserRole } from "@app/shared-enums";

import { EMAIL_VALIDATION, NOT_EMPTY_VALIDATION } from "core/commonValidationErrors";

import { UserEntity } from "core/entities/user";

export class InvitationEntity extends BaseEntity {
  static buildFromUserEntity(entity: UserEntity, currentUserIsAdmin: boolean) {
    return makeFnTransformableObject(
      () => new InvitationEntity(entity, currentUserIsAdmin),
      () => ({
        email: entity.email,
        name: entity.name,
        position: entity.position,
        phone: entity.phone,
        role: entity.role,
      }),
    );
  }

  static buildEmpty(currentUserIsAdmin: boolean) {
    return makeFnTransformableObject(() => new InvitationEntity(null, currentUserIsAdmin));
  }

  constructor(public user: UserEntity | null, private currentUserIsAdmin: boolean) {
    super();
    this.initEntity();
  }

  @observable @IsString() @IsEmail(undefined, { message: EMAIL_VALIDATION }) email = "";
  setEmail = this.createSetter("email");

  @observable @IsString() @MinLength(1, { message: NOT_EMPTY_VALIDATION }) name = "";
  setName = this.createSetter("name");

  @observable @IsString() position = "";
  setPosition = this.createSetter("position");

  @observable @IsEnum(UserRole) role = UserRole.USER;
  setRole = this.createSetter("role");

  @observable @IsString() phone = "";
  setPhone = this.createSetter("phone");

  @computed get apiCreateReady() {
    return {
      name: this.name,
      phone: this.phone || undefined,
      position: this.position || undefined,
      email: this.email,
      role: this.role,
    };
  }
}
