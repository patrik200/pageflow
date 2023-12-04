import { BaseGeneratedIDEntity, StorageFileEntity } from "@app/back-kit";
import { Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

import { TicketCommentEntity } from "../index";

@Entity({ name: "ticket_comment_files" })
export class TicketCommentFileEntity extends BaseGeneratedIDEntity {
  @ManyToOne(() => TicketCommentEntity, { onDelete: "CASCADE", nullable: false })
  comment!: TicketCommentEntity;

  @JoinColumn() @OneToOne(() => StorageFileEntity, { nullable: false }) file!: StorageFileEntity;
}
