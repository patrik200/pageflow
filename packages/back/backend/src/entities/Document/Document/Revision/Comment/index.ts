import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { BaseGeneratedIDEntity } from "@app/back-kit";
import { UserRole } from "@app/shared-enums";

import { UserEntity } from "entities/User";

import { DocumentRevisionEntity } from "../index";
import { DocumentRevisionCommentDiscussionEntity } from "../Discussion";
import { DocumentRevisionCommentFileEntity } from "./File";

@Entity({ name: "document_revision_comments" })
export class DocumentRevisionCommentEntity extends BaseGeneratedIDEntity {
  @ManyToOne(() => DocumentRevisionEntity, { nullable: false })
  revision!: DocumentRevisionEntity;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE", nullable: false })
  author!: UserEntity;

  @Column({ type: "text" })
  text!: string;

  @Column()
  resolved!: boolean;

  @Column()
  updated!: boolean;

  @OneToMany(() => DocumentRevisionCommentFileEntity, (commentFile) => commentFile.comment)
  files!: DocumentRevisionCommentFileEntity[];

  @OneToMany(() => DocumentRevisionCommentDiscussionEntity, (discussion) => discussion.comment)
  discussions!: DocumentRevisionCommentDiscussionEntity[];

  canResolve: boolean | null = null;

  calculateCanResolve(currentUser: { userId: string; role: UserRole }) {
    if (this.resolved) {
      this.canResolve = false;
      return;
    }

    if (currentUser.role === UserRole.ADMIN) {
      this.canResolve = true;
      return;
    }

    if (this.author.id === currentUser.userId) {
      this.canResolve = true;
      return;
    }

    this.canResolve = false;
  }

  canUpdate: boolean | null = null;

  calculateCanUpdate(currentUser: { userId: string; role: UserRole }) {
    if (currentUser.role === UserRole.ADMIN) {
      this.canUpdate = true;
      return;
    }

    if (this.author.id === currentUser.userId) {
      this.canUpdate = true;
      return;
    }

    this.canUpdate = false;
  }

  calculateAllCans(currentUser: { userId: string; role: UserRole }) {
    this.calculateCanResolve(currentUser);
    this.calculateCanUpdate(currentUser);
  }
}
