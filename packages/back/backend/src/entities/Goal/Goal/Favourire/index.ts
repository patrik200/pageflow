import { BaseGeneratedIDEntity } from "@app/back-kit";
import { Entity, ManyToOne, Unique } from "typeorm";

import { UserEntity } from "entities/User";

import { GoalEntity } from "../index";

@Entity({ name: "goal_favourites" })
@Unique(["user", "goal"])
export class GoalFavouriteEntity extends BaseGeneratedIDEntity {
  @ManyToOne(() => UserEntity, { onDelete: "CASCADE", nullable: false }) user!: UserEntity;

  @ManyToOne(() => GoalEntity, { onDelete: "CASCADE", nullable: false }) goal!: GoalEntity;
}