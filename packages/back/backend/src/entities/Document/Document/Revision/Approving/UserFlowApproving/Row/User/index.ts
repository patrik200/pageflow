import { BaseGeneratedIDEntity } from "@app/back-kit";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

import { UserEntity } from "entities/User";

import { DocumentRevisionResponsibleUserFlowRowEntity } from "../index";
import { DocumentRevisionResponsibleUserFlowRowUserFileEntity } from "./File";

@Entity({ name: "document_revision_responsible_user_flow_row_users" })
export class DocumentRevisionResponsibleUserFlowRowUserEntity extends BaseGeneratedIDEntity {
  @ManyToOne(() => DocumentRevisionResponsibleUserFlowRowEntity, (row) => row.users, {
    nullable: false,
  })
  row!: DocumentRevisionResponsibleUserFlowRowEntity;

  @Column() index!: number;

  @Column() description!: string;

  @Column({ default: false }) approved!: boolean;

  @Column({ nullable: true, type: "text" }) result!: string | null;

  @OneToMany(() => DocumentRevisionResponsibleUserFlowRowUserFileEntity, (rowUserFile) => rowUserFile.rowUser)
  files!: DocumentRevisionResponsibleUserFlowRowUserFileEntity[];

  @ManyToOne(() => UserEntity, { nullable: false }) user!: UserEntity;

  canApprove: boolean | null = null;
}
