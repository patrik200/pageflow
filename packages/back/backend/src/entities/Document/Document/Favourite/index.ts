import { BaseGeneratedIDEntity } from "@app/back-kit";
import { Entity, ManyToOne, Unique } from "typeorm";

import { UserEntity } from "entities/User";

import { DocumentEntity } from "../index";

@Entity({ name: "document_favourites" })
@Unique(["user", "document"])
export class DocumentFavouriteEntity extends BaseGeneratedIDEntity {
  @ManyToOne(() => UserEntity, { onDelete: "CASCADE", nullable: false }) user!: UserEntity;

  @ManyToOne(() => DocumentEntity, { onDelete: "CASCADE", nullable: false }) document!: DocumentEntity;
}
