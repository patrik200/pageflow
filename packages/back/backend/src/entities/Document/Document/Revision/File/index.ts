import { BaseGeneratedIDEntity, StorageFileEntity } from "@app/back-kit";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

import { DocumentRevisionEntity } from "../index";

@Entity({ name: "document_revision_files" })
export class DocumentRevisionFileEntity extends BaseGeneratedIDEntity {
  @ManyToOne(() => DocumentRevisionEntity, { nullable: false })
  revision!: DocumentRevisionEntity;

  @JoinColumn()
  @OneToOne(() => StorageFileEntity, { nullable: false })
  file!: StorageFileEntity;

  @Column()
  hasElasticAttachment!: boolean;
}
