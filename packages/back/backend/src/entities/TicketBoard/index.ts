import { Column, Entity, ManyToOne, OneToMany, Unique } from "typeorm";
import { BaseGeneratedIDEntity } from "@app/back-kit";

import { UserEntity } from "entities/User";
import { ClientEntity } from "entities/Client";
import { TicketEntity } from "entities/Ticket";
import { ProjectEntity } from "entities/Project";
import { PermissionEntity } from "entities/Permission";

import { TicketBoardFavouriteEntity } from "./Favourite";

@Entity({ name: "ticket_boards" })
@Unique(["client", "slug"])
export class TicketBoardEntity extends BaseGeneratedIDEntity {
  @ManyToOne(() => ClientEntity, { onDelete: "CASCADE", nullable: false }) client!: ClientEntity;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE", nullable: false }) author!: UserEntity;

  @ManyToOne(() => ProjectEntity, { nullable: true }) project!: ProjectEntity | null;

  @Column() name!: string;

  @Column() slug!: string;

  @Column({ default: 1 }) nextTicketNumber!: number;

  @Column() isPrivate!: boolean;

  @OneToMany(() => TicketBoardFavouriteEntity, (favourite) => favourite.board)
  favourites!: TicketBoardFavouriteEntity[];

  @OneToMany(() => TicketEntity, (ticket) => ticket.board) tickets!: TicketEntity[];

  // virtual fields --------

  permissions?: PermissionEntity[];

  favourite?: boolean;
}
