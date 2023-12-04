import { BaseGeneratedIDEntity, StorageFileEntity } from "@app/back-kit";
import { Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

import { CorrespondenceRevisionCommentEntity } from "../index";

@Entity({ name: "correspondence_revision_comment_files" })
export class CorrespondenceRevisionCommentFileEntity extends BaseGeneratedIDEntity {
  @ManyToOne(() => CorrespondenceRevisionCommentEntity, { nullable: false })
  comment!: CorrespondenceRevisionCommentEntity;

  @JoinColumn() @OneToOne(() => StorageFileEntity, { nullable: false }) file!: StorageFileEntity;
}
