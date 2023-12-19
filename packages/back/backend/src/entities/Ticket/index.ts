import { Column, Entity, Index, ManyToOne, OneToMany } from "typeorm";
import { BaseGeneratedIDEntity } from "@app/back-kit";
import { TicketPriorities } from "@app/shared-enums";

import { UserEntity } from "entities/User";
import { ClientEntity } from "entities/Client";
import { DictionaryValueEntity } from "entities/Dictionary/Dictionary";

import { TicketCommentEntity } from "./Comment";
import { TicketFileEntity } from "./File";
import { TicketFavouriteEntity } from "./Favourite";
import { TicketBoardEntity } from "../TicketBoard";
import { TicketRelationEntity } from "./TicketRelation";

@Entity({ name: "tickets" })
export class TicketEntity extends BaseGeneratedIDEntity {
  @ManyToOne(() => ClientEntity, { onDelete: "CASCADE", nullable: false }) client!: ClientEntity;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE", nullable: false }) author!: UserEntity;

  @ManyToOne(() => TicketBoardEntity, { nullable: false }) board!: TicketBoardEntity;

  @Column() name!: string;

  @Column() slug!: string;

  @Column({ type: "text", nullable: true }) description!: string | null;

  @Column({ type: "timestamptz", nullable: true }) deadlineAt!: Date | null;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE", nullable: true }) responsible!: UserEntity | null;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE", nullable: true }) customer!: UserEntity | null;

  @Column({ enum: TicketPriorities }) priority!: TicketPriorities;

  @OneToMany(() => TicketCommentEntity, (comment) => comment.ticket) comments!: TicketCommentEntity[];

  @OneToMany(() => TicketFileEntity, (file) => file.ticket) files!: TicketFileEntity[];

  @ManyToOne(() => DictionaryValueEntity, { nullable: false }) status!: DictionaryValueEntity;

  @ManyToOne(() => DictionaryValueEntity, { nullable: true }) type!: DictionaryValueEntity | null;

  @Index() @Column({ default: 0 }) sort!: number;

  @OneToMany(() => TicketFavouriteEntity, (favourite) => favourite.ticket)
  favourites!: TicketFavouriteEntity[];

  @OneToMany(() => TicketRelationEntity, (relation) => relation.mainTicket)
  relationsAsMain!: TicketRelationEntity[];

  @OneToMany(() => TicketRelationEntity, (relation) => relation.relatedTicket)
  relationsAsRelated!: TicketRelationEntity[];

  // virtual fields -----
  favourite?: boolean;
}
