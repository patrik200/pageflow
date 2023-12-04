import { UserRole } from "@app/shared-enums";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { BaseGeneratedIDEntity } from "@app/back-kit";

import { UserEntity } from "entities/User";

import { CorrespondenceRevisionEntity } from "../index";
import { CorrespondenceRevisionCommentFileEntity } from "./File";

@Entity({ name: "correspondence_revision_comments" })
export class CorrespondenceRevisionCommentEntity extends BaseGeneratedIDEntity {
  @ManyToOne(() => CorrespondenceRevisionEntity, { nullable: false })
  revision!: CorrespondenceRevisionEntity;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE", nullable: false })
  author!: UserEntity;

  @Column({ type: "text" })
  text!: string;

  @Column({ default: false })
  updated!: boolean;

  @OneToMany(() => CorrespondenceRevisionCommentFileEntity, (commentFile) => commentFile.comment)
  files!: CorrespondenceRevisionCommentFileEntity[];

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
