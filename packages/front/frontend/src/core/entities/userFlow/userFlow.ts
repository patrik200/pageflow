import { observable } from "mobx";
import { arrayOfEntitiesDecoder, BaseEntity, withDefaultValue } from "@app/kit";
import { Expose, Type } from "class-transformer";
import { IsDefined, IsEnum, IsString, ValidateNested, IsBoolean, IsNumber, IsOptional } from "class-validator";
import { UserFlowMode } from "@app/shared-enums";

import { UserEntity } from "core/entities/user";

export class UserFlowRowUserEntity extends BaseEntity {
  constructor() {
    super();
    this.initEntity();
  }

  @observable @Expose() @IsDefined() @IsString() description!: string;

  @observable
  @Expose()
  @IsDefined()
  @Type(() => UserEntity)
  @ValidateNested()
  user!: UserEntity;
}

export class UserFlowRowEntity extends BaseEntity {
  constructor() {
    super();
    this.initEntity();
  }

  @observable @Expose() @IsDefined() @IsEnum(UserFlowMode) mode!: UserFlowMode;

  @observable @Expose() @IsDefined() @IsString() name!: string;

  @observable @Expose() @IsDefined() @IsBoolean() forbidNextRowsApproving!: boolean;

  @observable
  @Expose()
  @IsDefined()
  @Type(() => UserFlowRowUserEntity)
  @ValidateNested({ each: true })
  users!: UserFlowRowUserEntity[];
}

export class UserFlowReviewerEntity extends BaseEntity {
  constructor() {
    super();
    this.initEntity();
  }

  @Expose()
  @IsDefined()
  @Type(() => UserEntity)
  @ValidateNested()
  user!: UserEntity;
}

export class UserFlowEntity extends BaseEntity {
  constructor() {
    super();
    this.initEntity();
  }

  @Expose() @IsDefined() @IsString() id!: string;

  @observable @Expose() @IsDefined() @IsString() name!: string;

  @observable
  @Expose()
  @IsOptional()
  @IsNumber()
  @withDefaultValue(null)
  deadlineDaysAmount!: number | null;

  @observable
  @Expose()
  @IsDefined()
  @IsBoolean()
  deadlineDaysIncludeWeekends!: boolean;

  @Expose()
  @IsOptional()
  @Type(() => UserFlowReviewerEntity)
  @ValidateNested()
  reviewer?: UserFlowReviewerEntity;

  @observable
  @Expose()
  @IsDefined()
  @Type(() => UserFlowRowEntity)
  @ValidateNested({ each: true })
  rows!: UserFlowRowEntity[];
}

export const arrayOfUserFlowEntities = arrayOfEntitiesDecoder(UserFlowEntity);
