import { BaseGeneratedIDEntity } from "@app/back-kit";
import { Column, Entity, ManyToOne, ManyToMany, Unique } from "typeorm";

import { CorrespondenceEntity } from "entities/Correspondence/Correspondence";
import { DocumentEntity } from "entities/Document/Document";

import { AttributeTypeEntity } from "../index";

@Entity({ name: "attribute_values" })
@Unique(["value", "attributeType"])
export class AttributeValueEntity extends BaseGeneratedIDEntity {
  @Column()
  value!: string;

  @ManyToOne(() => AttributeTypeEntity, { onDelete: "CASCADE", nullable: false })
  attributeType!: AttributeTypeEntity;

  @ManyToMany(() => CorrespondenceEntity, (correspondence) => correspondence.attributeValues)
  correspondences!: CorrespondenceEntity[];

  @ManyToMany(() => DocumentEntity, (document) => document.attributeValues)
  documents!: DocumentEntity[];
}
