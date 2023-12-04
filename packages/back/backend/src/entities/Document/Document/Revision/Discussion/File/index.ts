import { BaseGeneratedIDEntity, StorageFileEntity } from "@app/back-kit";
import { Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

import { DocumentRevisionCommentDiscussionEntity } from "../index";

@Entity({ name: "document_revision_comment_discussion_files" })
export class DocumentRevisionCommentDiscussionFileEntity extends BaseGeneratedIDEntity {
  @ManyToOne(() => DocumentRevisionCommentDiscussionEntity, { nullable: false })
  discussion!: DocumentRevisionCommentDiscussionEntity;

  @JoinColumn()
  @OneToOne(() => StorageFileEntity, { nullable: false })
  file!: StorageFileEntity;
}
