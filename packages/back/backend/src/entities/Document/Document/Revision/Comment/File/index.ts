import { BaseGeneratedIDEntity, StorageFileEntity } from "@app/back-kit";
import { Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

import { DocumentRevisionCommentEntity } from "../index";

@Entity({ name: "document_revision_comment_files" })
export class DocumentRevisionCommentFileEntity extends BaseGeneratedIDEntity {
  @ManyToOne(() => DocumentRevisionCommentEntity, { nullable: false })
  comment!: DocumentRevisionCommentEntity;

  @JoinColumn()
  @OneToOne(() => StorageFileEntity, { nullable: false })
  file!: StorageFileEntity;
}
