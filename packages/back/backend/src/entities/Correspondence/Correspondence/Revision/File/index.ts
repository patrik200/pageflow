import { BaseGeneratedIDEntity, StorageFileEntity } from "@app/back-kit";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

import { CorrespondenceRevisionEntity } from "../index";

@Entity({ name: "correspondence_revision_files" })
export class CorrespondenceRevisionFileEntity extends BaseGeneratedIDEntity {
  @ManyToOne(() => CorrespondenceRevisionEntity, { nullable: false })
  revision!: CorrespondenceRevisionEntity;

  @JoinColumn()
  @OneToOne(() => StorageFileEntity, { nullable: false })
  file!: StorageFileEntity;

  @Column()
  hasElasticAttachment!: boolean;
}
