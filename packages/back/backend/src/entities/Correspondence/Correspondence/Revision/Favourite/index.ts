import { BaseGeneratedIDEntity } from "@app/back-kit";
import { Entity, ManyToOne, Unique } from "typeorm";

import { UserEntity } from "entities/User";

import { CorrespondenceRevisionEntity } from "../index";

@Entity({ name: "correspondence_revision_favourites" })
@Unique(["user", "revision"])
export class CorrespondenceRevisionFavouriteEntity extends BaseGeneratedIDEntity {
  @ManyToOne(() => UserEntity, { onDelete: "CASCADE", nullable: false }) user!: UserEntity;

  @ManyToOne(() => CorrespondenceRevisionEntity, { onDelete: "CASCADE", nullable: false })
  revision!: CorrespondenceRevisionEntity;
}
