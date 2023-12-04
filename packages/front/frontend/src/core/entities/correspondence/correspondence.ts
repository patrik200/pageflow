import { arrayOfEntitiesDecoder, BaseEntity, IsDate, withDefaultValue } from "@app/kit";
import { Expose, Type } from "class-transformer";
import { IsBoolean, IsDefined, IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";
import { DateTime } from "luxon";
import { DateMode, IntlDate } from "@worksolutions/utils";
import { computed, observable } from "mobx";
import { CorrespondenceStatus, PermissionRole } from "@app/shared-enums";

import { UserEntity } from "core/entities/user";
import { MinimalProjectEntity } from "core/entities/project/project";
import { PermissionEntity } from "core/entities/permission/permision";
import { ChangeFeedEventEntity } from "core/entities/change-feed";
import { AttributeInEntityEntity } from "core/entities/attributes/attribute-in-entity";

import { MinimalCorrespondenceGroupEntity } from "./group";

export class CorrespondenceParentGroupEntity extends BaseEntity {
  constructor() {
    super();
    this.initEntity();
  }

  @Expose() @IsDefined() @IsString() id!: string;

  @Expose() @IsDefined() @IsString() name!: string;

  @Expose()
  @IsDefined()
  @Type(() => MinimalCorrespondenceGroupEntity)
  @ValidateNested({ each: true })
  groupsPath!: MinimalCorrespondenceGroupEntity[];
}

export class CorrespondenceRootGroupEntity extends BaseEntity {
  constructor() {
    super();
    this.initEntity();
  }

  @Expose()
  @IsOptional()
  @Type(() => MinimalProjectEntity)
  @ValidateNested()
  @withDefaultValue(null)
  project!: MinimalProjectEntity | null;
}

export class CorrespondenceEntity extends BaseEntity {
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

  @Expose() @IsDefined() @IsString() id!: string;

  @Expose() @IsDefined() @IsString() name!: string;

  @Expose() @IsOptional() @IsString() @withDefaultValue("") description!: string;

  @Expose() @IsDefined() @Type(() => UserEntity) @ValidateNested() author!: UserEntity;

  @observable @Expose() @IsDefined() @IsEnum(CorrespondenceStatus) status!: CorrespondenceStatus;
  setStatus = this.createSetter("status");

  @observable @Expose() @IsDefined() @IsBoolean() favourite!: boolean;
  setFavourite = this.createSetter("favourite");

  @observable @Expose() @IsDefined() @IsBoolean() canArchive!: boolean;
  setCanArchive = this.createSetter("canArchive");

  @observable @Expose() @IsDefined() @IsBoolean() canActive!: boolean;
  setCanActive = this.createSetter("canActive");

  @Expose()
  @IsOptional()
  @Type(() => CorrespondenceParentGroupEntity)
  @ValidateNested()
  @withDefaultValue(null)
  parentGroup!: CorrespondenceParentGroupEntity | null;

  @Expose()
  @IsOptional()
  @Type(() => CorrespondenceRootGroupEntity)
  @ValidateNested()
  @withDefaultValue(null)
  rootGroup!: CorrespondenceRootGroupEntity | null;

  @observable
  @Expose()
  @IsOptional()
  @withDefaultValue([])
  @Type(() => AttributeInEntityEntity)
  @ValidateNested({ each: true })
  attributeValues!: AttributeInEntityEntity[];

  @observable
  @Expose()
  @IsOptional()
  @withDefaultValue([])
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

  @Expose() @IsDefined() @IsDate() createdAt!: Date;

  @Expose() @IsDefined() @IsDate() updatedAt!: Date;

  @Expose() @IsDefined() @IsBoolean() isPrivate!: Boolean;

  @computed get viewCreatedAt() {
    return this.intlDate.formatDate(DateTime.fromJSDate(this.createdAt), DateMode.DATE_WITH_STRING_MONTH);
  }

  @computed get viewUpdatedAt() {
    return this.intlDate.formatDate(DateTime.fromJSDate(this.updatedAt), DateMode.DATE_WITH_STRING_MONTH);
  }

  @computed get archived() {
    return [CorrespondenceStatus.ARCHIVE].includes(this.status);
  }

  @observable changeFeedEvents: ChangeFeedEventEntity[] = [];
}

export const arrayOfCorrespondenceEntitiesDecoder = arrayOfEntitiesDecoder(CorrespondenceEntity);
