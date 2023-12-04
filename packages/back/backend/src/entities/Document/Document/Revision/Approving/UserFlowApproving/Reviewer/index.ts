import { Column, Entity, ManyToOne, OneToOne } from "typeorm";
import { BaseGeneratedIDEntity } from "@app/back-kit";

import { UserEntity } from "entities/User";

import { DocumentRevisionResponsibleUserFlowEntity } from "../index";

@Entity({ name: "document_revision_responsible_user_flow_reviewers" })
export class DocumentRevisionResponsibleUserFlowReviewerEntity extends BaseGeneratedIDEntity {
  @OneToOne(() => DocumentRevisionResponsibleUserFlowEntity, (userFlow) => userFlow.reviewer, {
    nullable: false,
  })
  userFlow!: DocumentRevisionResponsibleUserFlowEntity;

  @ManyToOne(() => UserEntity, { nullable: false }) user!: UserEntity;

  @Column()
  approved!: boolean;

  @Column({ type: "text", nullable: true })
  comment!: string | null;
}
