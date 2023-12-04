import { BaseGeneratedIDEntity } from "@app/back-kit";
import { Entity, ManyToOne, Unique } from "typeorm";

import { UserEntity } from "entities/User";

import { ProjectEntity } from "../index";

@Entity({ name: "project_favourites" })
@Unique(["user", "project"])
export class ProjectFavouriteEntity extends BaseGeneratedIDEntity {
  @ManyToOne(() => UserEntity, { onDelete: "CASCADE", nullable: false }) user!: UserEntity;

  @ManyToOne(() => ProjectEntity, { onDelete: "CASCADE", nullable: false }) project!: ProjectEntity;
}
