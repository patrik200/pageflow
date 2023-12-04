import { BaseGeneratedIDEntity } from "@app/back-kit";
import { Entity, ManyToOne, Unique } from "typeorm";

import { UserEntity } from "entities/User";

import { CorrespondenceEntity } from "../index";

@Entity({ name: "correspondence_favourites" })
@Unique(["user", "correspondence"])
export class CorrespondenceFavouriteEntity extends BaseGeneratedIDEntity {
  @ManyToOne(() => UserEntity, { onDelete: "CASCADE", nullable: false }) user!: UserEntity;

  @ManyToOne(() => CorrespondenceEntity, { onDelete: "CASCADE", nullable: false })
  correspondence!: CorrespondenceEntity;
}
