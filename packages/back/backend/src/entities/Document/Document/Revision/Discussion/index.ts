import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { BaseGeneratedIDEntity } from "@app/back-kit";
import { UserRole } from "@app/shared-enums";

import { UserEntity } from "entities/User";

import { DocumentRevisionCommentEntity } from "../Comment";
import { DocumentRevisionCommentDiscussionFileEntity } from "./File";

@Entity({ name: "document_revision_comment_discussion" })
export class DocumentRevisionCommentDiscussionEntity extends BaseGeneratedIDEntity {
  @ManyToOne(() => DocumentRevisionCommentEntity, { nullable: false })
  comment!: DocumentRevisionCommentEntity;

  @ManyToOne(() => UserEntity, { nullable: false })
  author!: UserEntity;

  @Column()
  updated!: boolean;

  @Column({ type: "text" })
  text!: string;

  @OneToMany(() => DocumentRevisionCommentDiscussionFileEntity, (discussionFile) => discussionFile.discussion)
  files!: DocumentRevisionCommentDiscussionFileEntity[];

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
    this.calculateCanUpdate(currentUser);
  }
}
