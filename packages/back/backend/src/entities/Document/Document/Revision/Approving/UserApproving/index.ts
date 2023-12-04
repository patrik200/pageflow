import { Column, Entity, ManyToOne, OneToOne } from "typeorm";
import { BaseGeneratedIDEntity } from "@app/back-kit";

import { UserEntity } from "entities/User";

import { DocumentRevisionEntity } from "../../index";

@Entity({ name: "document_revision_responsible_users" })
export class DocumentRevisionResponsibleUserEntity extends BaseGeneratedIDEntity {
  @OneToOne(() => DocumentRevisionEntity, { nullable: false })
  revision!: DocumentRevisionEntity;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE", nullable: false })
  user!: UserEntity;

  @Column({ default: false })
  approved!: boolean;

  @Column({ type: "text", nullable: true })
  comment!: string | null;
}
