import { TicketRelationTypes } from "@app/shared-enums";
import { Expose, Type } from "class-transformer";
import { IsDefined, IsEnum, IsString } from "class-validator";
import { arrayOfEntitiesDecoder, BaseEntity } from "@app/kit";

import { MinimalTicketEntity } from "./ticket";

export class TicketRelationEntity extends BaseEntity {
  constructor() {
    super();
    this.initEntity();
  }

  @Expose() @IsDefined() @IsString() id!: string;

  @Expose() @IsDefined() @Type(() => MinimalTicketEntity) mainTicket!: MinimalTicketEntity;

  @Expose() @IsDefined() @Type(() => MinimalTicketEntity) relatedTicket!: MinimalTicketEntity;

  @Expose() @IsDefined() @IsEnum(TicketRelationTypes) type!: TicketRelationTypes;
}

export const arrayOfTicketRelationEntitiesDecoder = arrayOfEntitiesDecoder(TicketRelationEntity);
