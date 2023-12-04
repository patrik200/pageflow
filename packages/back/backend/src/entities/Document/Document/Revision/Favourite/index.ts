import { BaseGeneratedIDEntity } from "@app/back-kit";
import { Entity, ManyToOne, Unique } from "typeorm";

import { UserEntity } from "entities/User";

import { DocumentRevisionEntity } from "../index";

@Entity({ name: "document_revision_favourites" })
@Unique(["user", "revision"])
export class DocumentRevisionFavouriteEntity extends BaseGeneratedIDEntity {
  @ManyToOne(() => UserEntity, { onDelete: "CASCADE", nullable: false }) user!: UserEntity;

  @ManyToOne(() => DocumentRevisionEntity, { onDelete: "CASCADE", nullable: false }) revision!: DocumentRevisionEntity;
}
