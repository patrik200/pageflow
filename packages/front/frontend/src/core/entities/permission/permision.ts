import { computed, observable } from "mobx";
import { Expose, Type } from "class-transformer";
import { arrayOfEntitiesDecoder, BaseEntity, makeTransformableObject } from "@app/kit";
import { IsBoolean, IsDefined, IsEnum, IsOptional, ValidateNested } from "class-validator";
import { PermissionRole } from "@app/shared-enums";

import { NOT_EMPTY_VALIDATION } from "core/commonValidationErrors";

import { UserEntity } from "../user";

export class PermissionEntity extends BaseEntity {
  static hasPermission(allPermissions: PermissionEntity[], currentUserId: string, roles: PermissionRole[]) {
    return allPermissions.some((permission) => {
      if (permission.user.id !== currentUserId) return false;
      return roles.includes(permission.role);
    });
  }

  static hasPermissionToEditEntity(allPermissions: PermissionEntity[], currentUserId: string) {
    return PermissionEntity.hasPermission(allPermissions, currentUserId, [PermissionRole.OWNER, PermissionRole.EDITOR]);
  }

  static buildEmpty() {
    return makeTransformableObject(PermissionEntity);
  }

  static buildReaderWithoutModifiers(user: UserEntity) {
    return makeTransformableObject(PermissionEntity, () => ({ role: PermissionRole.READER, user }));
  }

  static buildFromEntityLike(entity: {
    role: PermissionRole;
    user: UserEntity;
    canEditEditorPermissions?: boolean | null;
    canEditReaderPermissions?: boolean | null;
  }) {
    return makeTransformableObject(PermissionEntity, () => ({
      role: entity.role,
      user: entity.user,
      canEditEditorPermissions: entity.canEditEditorPermissions ?? null,
      canEditReaderPermissions: entity.canEditReaderPermissions ?? null,
    }));
  }

  static buildOwner(user: UserEntity) {
    return makeTransformableObject(PermissionEntity, () => ({ role: PermissionRole.OWNER, user }));
  }

  constructor() {
    super();
    this.initEntity();
    this.registerOnBuildCallback(() => {
      this.registerCustomOnFieldChangeCallback(
        () => this.role === PermissionRole.READER && this.setCanEditEditorPermissions(null),
        "role",
        10,
      );
      this.registerCustomOnFieldChangeCallback(
        () => this.role === PermissionRole.EDITOR && this.setCanEditReaderPermissions(null),
        "role",
        10,
      );
    });
  }

  @observable @Expose() @IsDefined({ message: NOT_EMPTY_VALIDATION }) @IsEnum(PermissionRole) role!: PermissionRole;
  setRole = this.createSetter("role");

  @observable
  @Expose()
  @IsDefined({ message: NOT_EMPTY_VALIDATION })
  @Type(() => UserEntity)
  @ValidateNested()
  user!: UserEntity;
  setUser = this.createSetter("user");

  @observable @Expose() @IsOptional() @IsBoolean() canEditEditorPermissions!: boolean | null;
  setCanEditEditorPermissions = this.createSetter("canEditEditorPermissions");

  @observable @Expose() @IsOptional() @IsBoolean() canEditReaderPermissions!: boolean | null;
  setCanEditReaderPermissions = this.createSetter("canEditReaderPermissions");

  @computed get canCreateEditor() {
    return this.role === PermissionRole.EDITOR;
  }

  @computed get rolesCanCreateForPublic() {
    if (this.role === PermissionRole.READER) return [PermissionRole.READER];

    if (this.role === PermissionRole.EDITOR) {
      if (this.canEditEditorPermissions) return [PermissionRole.EDITOR, PermissionRole.READER];
      return [PermissionRole.READER];
    }

    return [PermissionRole.EDITOR, PermissionRole.READER];
  }

  @computed get rolesCanCreateForPrivate() {
    if (this.role === PermissionRole.READER) {
      if (this.canEditReaderPermissions) return [PermissionRole.READER];
      return [];
    }

    if (this.role === PermissionRole.EDITOR) {
      if (this.canEditEditorPermissions) return [PermissionRole.EDITOR, PermissionRole.READER];
      return [PermissionRole.READER];
    }

    return [PermissionRole.EDITOR, PermissionRole.READER];
  }

  @computed get rolesCanCreateForYourself() {
    if (this.role === PermissionRole.READER) return [PermissionRole.READER];
    if (this.role === PermissionRole.EDITOR) return [PermissionRole.EDITOR, PermissionRole.READER];
    return [];
  }

  static get rolesCanCreateAdmin() {
    return [PermissionRole.EDITOR, PermissionRole.READER];
  }

  clone() {
    return makeTransformableObject(PermissionEntity, () => ({
      role: this.role,
      user: this.user,
      canEditEditorPermissions: this.canEditEditorPermissions,
      canEditReaderPermissions: this.canEditReaderPermissions,
    }));
  }

  @computed get apiReady() {
    return {
      role: this.role,
      userId: this.user.id,
      canEditEditorPermissions: this.canEditEditorPermissions,
      canEditReaderPermissions: this.canEditReaderPermissions,
    };
  }
}

export const arrayOfPermissionEntitiesDecoder = arrayOfEntitiesDecoder(PermissionEntity);
