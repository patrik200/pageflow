import { BaseGeneratedIDEntity } from "@app/back-kit";
import { TicketRelationTypes } from "@app/shared-enums";
import { Column, Entity, ManyToOne } from "typeorm";

import { TicketEntity } from "../index";

@Entity({ name: "ticket_relations" })
export class TicketRelationEntity extends BaseGeneratedIDEntity {
  @Column({ type: "enum", enum: TicketRelationTypes })
  type!: TicketRelationTypes;

  @ManyToOne(() => TicketEntity, (ticket) => ticket.relationsAsMain, { onDelete: "CASCADE", nullable: false })
  mainTicket!: TicketEntity;

  @ManyToOne(() => TicketEntity, (ticket) => ticket.relationsAsRelated, { onDelete: "CASCADE", nullable: false })
  relatedTicket!: TicketEntity;
}
