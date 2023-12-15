import { BaseGeneratedIDEntity } from "@app/back-kit";
import { Column, Entity, OneToMany, ManyToOne } from "typeorm";

import { ProjectEntity } from "entities/Project";

import { TimepointEntity } from "../Timepoint";

@Entity({ name: "goals" })
export class GoalEntity extends BaseGeneratedIDEntity {
  @OneToMany(() => TimepointEntity, (timepoint) => timepoint.goal, { nullable: false })
  timepoints!: TimepointEntity[];

  @ManyToOne(() => ProjectEntity, { onDelete: "CASCADE", nullable: false })
  project!: ProjectEntity;

  @Column()
  name!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;
}
