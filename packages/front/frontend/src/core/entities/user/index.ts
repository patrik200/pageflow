import { computed, observable } from "mobx";
import { arrayOfEntitiesDecoder, BaseEntity, IsDate, withDefaultValue } from "@app/kit";
import { UserRole } from "@app/shared-enums";
import { Expose, Type } from "class-transformer";
import { IsBoolean, IsDefined, IsEnum, IsOptional, IsString } from "class-validator";

import { FileEntity } from "core/entities/file";

export class UserEntity extends BaseEntity {
  constructor() {
    super();
    this.initEntity();
  }

  @observable @Expose() @IsDefined() @IsString() id!: string;

  @observable @Expose() @IsDefined() @IsString() email!: string;

  @observable @Expose() @IsDefined() @IsString() name!: string;

  @observable @Expose() @IsDefined() @IsString() @withDefaultValue("") position!: string;

  @observable @Expose() @IsDefined() @IsString() @withDefaultValue("") phone!: string;

  @observable @Expose() @IsDefined() @IsEnum(UserRole) role!: UserRole;

  @observable @Expose() @IsOptional() @Type(() => FileEntity) @withDefaultValue(null) avatar!: FileEntity | null;

  @observable @Expose() @IsOptional() @IsDate() unavailableUntil!: Date | null;

  @Expose() @IsOptional() @IsBoolean() @withDefaultValue(false) canUpdate!: boolean;

  @Expose() @IsOptional() @IsBoolean() @withDefaultValue(false) canDelete!: boolean;

  @Expose() @IsOptional() @IsBoolean() @withDefaultValue(false) canRestore!: boolean;

  @computed get isAdmin() {
    return this.role === UserRole.ADMIN;
  }
}

export const arrayOfUserEntitiesDecoder = arrayOfEntitiesDecoder(UserEntity);
