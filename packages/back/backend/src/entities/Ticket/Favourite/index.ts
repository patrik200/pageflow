import { BaseGeneratedIDEntity } from "@app/back-kit";
import { Entity, ManyToOne, Unique } from "typeorm";

import { UserEntity } from "entities/User";

import { TicketEntity } from "../index";

@Entity({ name: "ticket_favourites" })
@Unique(["user", "ticket"])
export class TicketFavouriteEntity extends BaseGeneratedIDEntity {
  @ManyToOne(() => UserEntity, { onDelete: "CASCADE", nullable: false }) user!: UserEntity;

  @ManyToOne(() => TicketEntity, { onDelete: "CASCADE", nullable: false }) ticket!: TicketEntity;
}
