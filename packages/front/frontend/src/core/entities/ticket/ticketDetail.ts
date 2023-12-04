import { observable } from "mobx";
import { Expose, Type } from "class-transformer";
import { withDefaultValue } from "@app/kit";
import { IsDefined, IsOptional, IsString, ValidateNested } from "class-validator";

import { UserEntity } from "core/entities/user";
import { ChangeFeedEventEntity } from "core/entities/change-feed";

import { TicketEntity } from "./ticket";

export class TicketDetailEntity extends TicketEntity {
  constructor() {
    super();
    this.initEntity();
  }

  @observable changeFeedEvents: ChangeFeedEventEntity[] = [];

  @observable @Expose() @IsOptional() @withDefaultValue("") @IsString() description!: string;

  @observable
  @Expose()
  @IsDefined()
  @Type(() => UserEntity)
  @ValidateNested()
  author!: UserEntity;
}
