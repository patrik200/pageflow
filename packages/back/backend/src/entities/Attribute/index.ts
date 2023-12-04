import { BaseGeneratedIDEntity } from "@app/back-kit";
import { AttributeCategory } from "@app/shared-enums";
import { Column, Entity, OneToMany, ManyToOne, Unique } from "typeorm";

import { ClientEntity } from "entities/Client";

import { AttributeValueEntity } from "./value";

@Entity({ name: "attribute_types" })
@Unique(["key", "category", "client"])
export class AttributeTypeEntity extends BaseGeneratedIDEntity {
  @Column()
  key!: string;

  @Column({ type: "enum", enum: AttributeCategory })
  category!: AttributeCategory;

  @ManyToOne(() => ClientEntity, { onDelete: "CASCADE", nullable: false })
  client!: ClientEntity;

  @OneToMany(() => AttributeValueEntity, (attribute) => attribute.attributeType)
  attributes!: AttributeValueEntity[];
}
