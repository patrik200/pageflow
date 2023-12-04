import { computed, observable } from "mobx";
import { Expose } from "class-transformer";
import { arrayOfEntitiesDecoder, BaseEntity } from "@app/kit";
import { IsBoolean, IsDefined, IsString } from "class-validator";

import { PermissionEntity } from "core/entities/permission/permision";
import { UserEntity } from "core/entities/user";

export class TicketBoardEntity extends BaseEntity {
  constructor() {
    super();
    this.initEntity();
  }

  protected currentUser!: UserEntity;

  configure(currentUser: UserEntity) {
    this.currentUser = currentUser;
  }

  @observable @Expose() @IsDefined() @IsString() id!: string;

  @observable @Expose() @IsDefined() @IsString() name!: string;

  @observable @Expose() @IsDefined() @IsBoolean() isPrivate!: boolean;

  @observable @Expose() @IsDefined() @IsBoolean() favourite!: boolean;

  @observable permissions: PermissionEntity[] = [];

  @computed get resultCanEdit() {
    return PermissionEntity.hasPermissionToEditEntity(this.permissions, this.currentUser.id);
  }
}

export const arrayOfTicketBoardEntitiesDecoder = arrayOfEntitiesDecoder(TicketBoardEntity);
