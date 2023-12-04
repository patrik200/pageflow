import { BaseGeneratedIDEntity } from "@app/back-kit";
import { UserFlowMode } from "@app/shared-enums";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

import { DocumentRevisionResponsibleUserFlowEntity } from "../index";
import { DocumentRevisionResponsibleUserFlowRowUserEntity } from "./User";

@Entity({ name: "document_revision_responsible_user_flow_rows" })
export class DocumentRevisionResponsibleUserFlowRowEntity extends BaseGeneratedIDEntity {
  @ManyToOne(() => DocumentRevisionResponsibleUserFlowEntity, (userFlow) => userFlow.rows, {
    nullable: false,
  })
  userFlow!: DocumentRevisionResponsibleUserFlowEntity;

  @Column() name!: string;

  @Column({ enum: UserFlowMode }) mode!: UserFlowMode;

  @Column() forbidNextRowsApproving!: boolean;

  @Column() index!: number;

  @OneToMany(() => DocumentRevisionResponsibleUserFlowRowUserEntity, (user) => user.row)
  users!: DocumentRevisionResponsibleUserFlowRowUserEntity[];

  completed: boolean | null = null;
}
