import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique } from "typeorm";
import { BaseGeneratedIDEntity } from "@app/back-kit";
import { DictionaryTypes } from "@app/shared-enums";

import { ClientEntity } from "entities/Client";

@Entity({ name: "dictionary" })
@Unique("client_type", ["client", "type"])
export class DictionaryEntity extends BaseGeneratedIDEntity {
  @JoinColumn()
  @ManyToOne(() => ClientEntity, { nullable: false, onDelete: "CASCADE" })
  client!: ClientEntity;

  @OneToMany(() => DictionaryValueEntity, (value) => value.dictionary)
  values!: DictionaryValueEntity[];

  @Column({ enum: DictionaryTypes, length: 128 }) type!: DictionaryTypes;

  // virtual fields ------
  required?: boolean;
}

@Entity({ name: "dictionary_values" })
@Unique("dictionary_key", ["dictionary", "key"])
export class DictionaryValueEntity extends BaseGeneratedIDEntity {
  @ManyToOne(() => DictionaryEntity, { nullable: false, onDelete: "CASCADE" })
  dictionary!: DictionaryEntity;

  @Column() key!: string;

  @Column() value!: string;

  @Column() sort!: number;

  @Column() canDelete!: boolean;
}
