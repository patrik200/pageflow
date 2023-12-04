import { BaseGeneratedIDEntity } from "@app/back-kit";
import { Entity, ManyToOne, Unique } from "typeorm";

import { UserEntity } from "entities/User";

import { TicketBoardEntity } from "../index";

@Entity({ name: "ticket_board_favourites" })
@Unique(["user", "board"])
export class TicketBoardFavouriteEntity extends BaseGeneratedIDEntity {
  @ManyToOne(() => UserEntity, { onDelete: "CASCADE", nullable: false }) user!: UserEntity;

  @ManyToOne(() => TicketBoardEntity, { onDelete: "CASCADE", nullable: false }) board!: TicketBoardEntity;
}
