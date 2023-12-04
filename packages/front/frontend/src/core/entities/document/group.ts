import { arrayOfEntitiesDecoder, BaseEntity, IsDate, withDefaultValue } from "@app/kit";
import { Expose, Type } from "class-transformer";
import { IsBoolean, IsDefined, IsOptional, IsString, ValidateNested } from "class-validator";
import { DateMode, IntlDate } from "@worksolutions/utils";
import { DateTime } from "luxon";
import { computed, observable } from "mobx";
import { PermissionRole } from "@app/shared-enums";

import { UserEntity } from "core/entities/user";
import { MinimalProjectEntity } from "core/entities/project/project";
import { PermissionEntity } from "core/entities/permission/permision";

export class MinimalDocumentGroupEntity extends BaseEntity {
  constructor() {
    super();
    this.initEntity();
  }

  @Expose() @IsDefined() @IsString() id!: string;

  @Expose() @IsDefined() @IsString() name!: string;
}

export class DocumentGroupRootGroupEntity extends BaseEntity {
  constructor() {
    super();
    this.initEntity();
  }

  @Expose()
  @IsDefined()
  @Type(() => MinimalProjectEntity)
  @ValidateNested()
  @withDefaultValue(null)
  project!: MinimalProjectEntity;
}

export class DocumentGroupEntity extends MinimalDocumentGroupEntity {
  constructor() {
    super();
    this.initEntity();
  }

  private intlDate!: IntlDate;
  protected currentUser!: UserEntity;

  configure(intlDate: IntlDate, currentUser: UserEntity) {
    this.intlDate = intlDate;
    this.currentUser = currentUser;
  }

  @Expose() @IsOptional() @IsString() @withDefaultValue("") description!: string;

  @Expose() @IsDefined() @Type(() => UserEntity) @ValidateNested() author!: UserEntity;

  @Expose() @IsDefined() @IsDate() createdAt!: Date;

  @Expose() @IsDefined() @IsDate() updatedAt!: Date;

  @observable @Expose() @IsDefined() @IsBoolean() favourite!: boolean;
  setFavourite = this.createSetter("favourite");

  @Expose()
  @IsOptional()
  @Type(() => DocumentGroupRootGroupEntity)
  @ValidateNested()
  @withDefaultValue(null)
  rootGroup!: DocumentGroupRootGroupEntity | null;

  @Expose() @IsDefined() @IsBoolean() isPrivate!: boolean;

  @observable
  @Expose()
  @IsDefined()
  @Type(() => PermissionEntity)
  @ValidateNested({ each: true })
  permissions!: PermissionEntity[];

  @computed get resultCanEdit() {
    if (this.currentUser.isAdmin) return true;
    return this.permissions.some((permission) => {
      if (permission.user.id !== this.currentUser.id) return false;
      return [PermissionRole.OWNER, PermissionRole.EDITOR].includes(permission.role);
    });
  }

  @computed get viewCreatedAt() {
    return this.intlDate.formatDate(DateTime.fromJSDate(this.createdAt), DateMode.DATE_WITH_STRING_MONTH);
  }

  @computed get viewUpdatedAt() {
    return this.intlDate.formatDate(DateTime.fromJSDate(this.createdAt), DateMode.DATE_WITH_STRING_MONTH);
  }
}

export const arrayOfDocumentGroupEntitiesDecoder = arrayOfEntitiesDecoder(DocumentGroupEntity);
