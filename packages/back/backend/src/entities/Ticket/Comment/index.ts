import { BaseGeneratedIDEntity } from "@app/back-kit";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { UserRole } from "@app/shared-enums";

import { UserEntity } from "entities/User";

import { TicketCommentFileEntity } from "./File";
import { TicketEntity } from "../index";

@Entity({ name: "ticket_comments" })
export class TicketCommentEntity extends BaseGeneratedIDEntity {
  @ManyToOne(() => TicketEntity, { onDelete: "CASCADE" }) ticket!: TicketEntity;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" }) author!: UserEntity;

  @Column({ type: "text" }) text!: string;

  @Column() updated!: boolean;

  @ManyToOne(() => TicketCommentEntity, { onDelete: "CASCADE", nullable: true })
  replyFor!: TicketCommentEntity | null;

  @OneToMany(() => TicketCommentFileEntity, (commentFile) => commentFile.comment)
  files!: TicketCommentFileEntity[];

  canUpdate: boolean | null = null;
  calculateCanUpdate(currentUser: { role: UserRole; userId: string }) {
    if (currentUser.role === UserRole.ADMIN) {
      this.canUpdate = true;
      return;
    }
    if (this.author.id === currentUser.userId) {
      this.canUpdate = true;
      return;
    }

    this.canUpdate = true;
  }

  calculateAllCans(currentUser: { role: UserRole; userId: string }) {
    this.calculateCanUpdate(currentUser);
  }
}
