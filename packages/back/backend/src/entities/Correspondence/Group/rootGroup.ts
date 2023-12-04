import { BaseGeneratedIDEntity } from "@app/back-kit";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

import { ClientEntity } from "entities/Client";
import { ProjectEntity } from "entities/Project";
import { DocumentEntity } from "entities/Document/Document";

import { CorrespondenceGroupEntity } from "./group";
import { CorrespondenceEntity } from "../Correspondence";

@Entity({ name: "correspondence_root_groups" })
export class CorrespondenceRootGroupEntity extends BaseGeneratedIDEntity {
  @ManyToOne(() => ClientEntity, { onDelete: "CASCADE", nullable: false })
  client!: ClientEntity;

  @Column()
  name!: string;

  @ManyToOne(() => ProjectEntity, { nullable: true })
  parentProject!: ProjectEntity | null;

  @ManyToOne(() => DocumentEntity, { nullable: true })
  parentDocument!: DocumentEntity | null;

  @OneToMany(() => CorrespondenceGroupEntity, (childrenGroup) => childrenGroup.rootGroup)
  allChildrenGroups!: CorrespondenceGroupEntity[];

  @OneToMany(() => CorrespondenceEntity, (childrenCorrespondence) => childrenCorrespondence.rootGroup)
  allChildrenCorrespondences!: CorrespondenceEntity[];
}
