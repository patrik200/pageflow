import { Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { BaseGeneratedIDEntity, StorageFileEntity } from "@app/back-kit";

import { DocumentRevisionResponsibleUserFlowRowUserEntity } from "../index";

@Entity({ name: "document_revision_responsible_user_flow_row_user_files" })
export class DocumentRevisionResponsibleUserFlowRowUserFileEntity extends BaseGeneratedIDEntity {
  @ManyToOne(() => DocumentRevisionResponsibleUserFlowRowUserEntity, (rowUser) => rowUser.files, {
    nullable: false,
  })
  rowUser!: DocumentRevisionResponsibleUserFlowRowUserEntity;

  @JoinColumn()
  @OneToOne(() => StorageFileEntity, { nullable: false })
  file!: StorageFileEntity;
}
