import { BaseGeneratedIDEntity } from "@app/back-kit";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

import { ClientEntity } from "entities/Client";
import { ProjectEntity } from "entities/Project";

import { DocumentGroupEntity } from "./group";
import { DocumentEntity } from "../Document";

@Entity({ name: "document_root_groups" })
export class DocumentRootGroupEntity extends BaseGeneratedIDEntity {
  @ManyToOne(() => ClientEntity, { onDelete: "CASCADE", nullable: false })
  client!: ClientEntity;

  @Column()
  name!: string;

  @ManyToOne(() => ProjectEntity, { nullable: true })
  parentProject!: ProjectEntity | null;

  @OneToMany(() => DocumentGroupEntity, (childrenGroup) => childrenGroup.rootGroup)
  allChildrenGroups!: DocumentGroupEntity[];

  @OneToMany(() => DocumentEntity, (childrenDocument) => childrenDocument.rootGroup)
  allChildrenDocuments!: DocumentEntity[];
}
