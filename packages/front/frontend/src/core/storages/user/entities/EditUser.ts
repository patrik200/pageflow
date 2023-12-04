import { computed, observable, action } from "mobx";
import { BaseEntity, IsDate, makeFnTransformableObject, MatchValidation } from "@app/kit";
import { IsEmail, IsEnum, IsString, MinLength, ValidateIf, IsOptional } from "class-validator";
import { UserRole } from "@app/shared-enums";

import { EMAIL_VALIDATION, NOT_EMPTY_VALIDATION, PASSWORDS_SHOULD_BE_EQUALS } from "core/commonValidationErrors";

import { UserEntity } from "core/entities/user";
import { InvitationPayloadEntity } from "core/entities/invitation";

export class EditUserEntity extends BaseEntity {
  static buildFromUserEntity(entity: UserEntity, currentUserIsAdmin: boolean) {
    return makeFnTransformableObject(
      () => new EditUserEntity(entity, currentUserIsAdmin),
      () => ({
        email: entity.email,
        name: entity.name,
        position: entity.position,
        phone: entity.phone,
        role: entity.role,
        unavailableUntil: entity.unavailableUntil,
      }),
    );
  }

  static buildEmpty(currentUserIsAdmin: boolean) {
    return makeFnTransformableObject(() => new EditUserEntity(null, currentUserIsAdmin));
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

  @observable @IsOptional() @IsDate() unavailableUntil: Date | null = null;
  setUnavailableUntilUntil = this.createSetter("unavailableUntil");

  @observable
  @IsString()
  @MinLength(1, { message: NOT_EMPTY_VALIDATION })
  @ValidateIf((entity: EditUserEntity) => !entity.user)
  password = "";
  setPassword = this.createSetter("password");

  @observable
  @IsString()
  @MatchValidation("password", { message: PASSWORDS_SHOULD_BE_EQUALS })
  @ValidateIf((entity: EditUserEntity) => !entity.user)
  repeatPassword = "";
  setRepeatPassword = this.createSetter("repeatPassword");

  @computed get apiUpdateReady() {
    return {
      name: this.name,
      phone: this.phone || null,
      position: this.position || null,
      email: this.currentUserIsAdmin ? this.email : undefined,
      role: this.currentUserIsAdmin ? this.role : undefined,
      unavailableUntil: this.unavailableUntil,
    };
  }

  @computed get apiCreateReady() {
    return {
      name: this.name,
      phone: this.phone || undefined,
      position: this.position || undefined,
      email: this.email,
      role: this.role,
      password: this.password,
    };
  }

  @action restoreFromInvitation(invitation: InvitationPayloadEntity) {
    this.setName(invitation.name);
    this.setRole(invitation.role);
    this.setEmail(invitation.email);
    if (invitation.phone) this.setPhone(invitation.phone);
    if (invitation.position) this.setPosition(invitation.position);
  }
}

export class EditUserPasswordEntity extends BaseEntity {
  static buildEmpty(user: UserEntity) {
    return makeFnTransformableObject(() => new EditUserPasswordEntity(user));
  }

  constructor(public user: UserEntity) {
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

  @computed get apiSaveReady() {
    return {
      password: this.password,
    };
  }
}
