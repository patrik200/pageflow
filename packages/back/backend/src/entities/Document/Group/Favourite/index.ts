import { BaseGeneratedIDEntity } from "@app/back-kit";
import { Entity, ManyToOne, Unique } from "typeorm";

import { UserEntity } from "entities/User";

import { DocumentGroupEntity } from "../group";

@Entity({ name: "document_group_favourites" })
@Unique(["user", "group"])
export class DocumentGroupFavouriteEntity extends BaseGeneratedIDEntity {
  @ManyToOne(() => UserEntity, { onDelete: "CASCADE", nullable: false }) user!: UserEntity;

  @ManyToOne(() => DocumentGroupEntity, { onDelete: "CASCADE", nullable: false }) group!: DocumentGroupEntity;
}
