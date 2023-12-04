import { Column, Entity, ManyToOne } from "typeorm";
import { BaseGeneratedIDEntity } from "@app/back-kit";

import { DictionaryValueEntity } from "entities/Dictionary/Dictionary";

import { DocumentRevisionEntity } from "../index";

@Entity({ name: "document_revisions_return_counts" })
export class DocumentRevisionReturnCountsEntity extends BaseGeneratedIDEntity {
  @ManyToOne(() => DocumentRevisionEntity, { onDelete: "CASCADE", nullable: false })
  revision!: DocumentRevisionEntity;

  @ManyToOne(() => DictionaryValueEntity, { nullable: false })
  returnCode!: DictionaryValueEntity;

  @Column({ default: 1 })
  count!: number;
}
