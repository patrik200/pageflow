import { BaseGeneratedIDEntity } from "@app/back-kit";
import { Entity, ManyToOne, Unique } from "typeorm";

import { UserEntity } from "entities/User";

import { CorrespondenceGroupEntity } from "../group";

@Entity({ name: "correspondence_group_favourites" })
@Unique(["user", "group"])
export class CorrespondenceGroupFavouriteEntity extends BaseGeneratedIDEntity {
  @ManyToOne(() => UserEntity, { onDelete: "CASCADE", nullable: false }) user!: UserEntity;

  @ManyToOne(() => CorrespondenceGroupEntity, { onDelete: "CASCADE", nullable: false })
  group!: CorrespondenceGroupEntity;
}
