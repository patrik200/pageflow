import { BaseGeneratedIDEntity, StorageFileEntity } from "@app/back-kit";
import { Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

import { TicketEntity } from "../index";

@Entity({ name: "ticket_files" })
export class TicketFileEntity extends BaseGeneratedIDEntity {
  @ManyToOne(() => TicketEntity, { onDelete: "CASCADE", nullable: false }) ticket!: TicketEntity;

  @JoinColumn() @OneToOne(() => StorageFileEntity, { nullable: false }) file!: StorageFileEntity;
}
