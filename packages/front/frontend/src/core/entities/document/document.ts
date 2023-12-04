import { arrayOfEntitiesDecoder, BaseEntity, IsDate, withDefaultValue } from "@app/kit";
import { Expose, Type } from "class-transformer";
import { IsBoolean, IsDefined, IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";
import { DateTime } from "luxon";
import { DateMode, IntlDate } from "@worksolutions/utils";
import { computed, observable } from "mobx";
import { DocumentRevisionStatus, DocumentStatus, PermissionRole } from "@app/shared-enums";

import { UserEntity } from "core/entities/user";
import { MinimalProjectEntity } from "core/entities/project/project";
import { UserFlowEntity } from "core/entities/userFlow/userFlow";
import { PermissionEntity } from "core/entities/permission/permision";
import { ChangeFeedEventEntity } from "core/entities/change-feed";
import { AttributeInEntityEntity } from "core/entities/attributes/attribute-in-entity";

import { MinimalDocumentGroupEntity } from "./group";

export class DocumentParentGroupEntity extends BaseEntity {
  constructor() {
    super();
    this.initEntity();
  }

  @Expose() @IsDefined() @IsString() id!: string;

  @Expose() @IsDefined() @IsString() name!: string;

  @Expose()
  @IsDefined()
  @Type(() => MinimalDocumentGroupEntity)
  @ValidateNested({ each: true })
  groupsPath!: MinimalDocumentGroupEntity[];
}

export class DocumentRootGroupEntity extends BaseEntity {
  constructor() {
    super();
    this.initEntity();
  }

  @Expose()
  @IsDefined()
  @Type(() => MinimalProjectEntity)
  @ValidateNested()
  project!: MinimalProjectEntity;
}

export class DocumentTypeEntity {
  @Expose() @IsDefined() @IsString() key!: string;
}

export class DocumentEntity extends BaseEntity {
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

  @Expose()
  @IsOptional()
  @Type(() => DocumentTypeEntity)
  @ValidateNested()
  @withDefaultValue(null)
  type!: DocumentTypeEntity | null;

  @observable @Expose() @IsDefined() @IsEnum(DocumentStatus) status!: DocumentStatus;
  setStatus = this.createSetter("status");

  @observable @Expose() @IsDefined() @IsBoolean() favourite!: boolean;
  setFavourite = this.createSetter("favourite");

  @observable @Expose() @IsDefined() @IsBoolean() canArchive!: boolean;
  setCanArchive = this.createSetter("canArchive");

  @observable @Expose() @IsDefined() @IsBoolean() canActive!: boolean;
  setCanActive = this.createSetter("canActive");

  @Expose()
  @IsOptional()
  @IsEnum(DocumentRevisionStatus)
  @withDefaultValue(null)
  lastRevisionStatus!: DocumentRevisionStatus | null;

  @Expose()
  @IsOptional()
  @Type(() => DocumentParentGroupEntity)
  @ValidateNested()
  @withDefaultValue(null)
  parentGroup!: DocumentParentGroupEntity | null;

  @Expose()
  @IsOptional()
  @Type(() => DocumentRootGroupEntity)
  @ValidateNested()
  @withDefaultValue(null)
  rootGroup!: DocumentRootGroupEntity | null;

  @Expose()
  @IsOptional()
  @Type(() => UserEntity)
  @ValidateNested()
  @withDefaultValue(null)
  responsibleUser!: UserEntity | null;

  @Expose()
  @IsOptional()
  @Type(() => UserFlowEntity)
  @ValidateNested()
  @withDefaultValue(null)
  responsibleUserFlow!: UserFlowEntity | null;

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

  @Expose() @IsDefined() @IsBoolean() isPrivate!: boolean;

  @computed get viewCreatedAt() {
    return this.intlDate.formatDate(DateTime.fromJSDate(this.createdAt), DateMode.DATE_WITH_STRING_MONTH);
  }

  @computed get viewUpdatedAt() {
    return this.intlDate.formatDate(DateTime.fromJSDate(this.createdAt), DateMode.DATE_WITH_STRING_MONTH);
  }

  @computed get archived() {
    return [DocumentStatus.ARCHIVE].includes(this.status);
  }

  @observable changeFeedEvents: ChangeFeedEventEntity[] = [];
}

export const arrayOfDocumentEntitiesDecoder = arrayOfEntitiesDecoder(DocumentEntity);
