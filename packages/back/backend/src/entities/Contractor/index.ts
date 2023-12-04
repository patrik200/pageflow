import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { BaseGeneratedIDEntity, StorageFileEntity } from "@app/back-kit";

import { ClientEntity } from "entities/Client";

@Entity({ name: "contractors" })
export class ContractorEntity extends BaseGeneratedIDEntity {
  @ManyToOne(() => ClientEntity, { onDelete: "CASCADE", nullable: false }) client!: ClientEntity;

  @Column() name!: string;

  @JoinColumn()
  @OneToOne(() => StorageFileEntity, { nullable: true, onDelete: "SET NULL" })
  logo!: StorageFileEntity | null;
}
