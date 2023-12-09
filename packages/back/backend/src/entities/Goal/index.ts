import { BaseGeneratedIDEntity } from "@app/back-kit";
import { Column, Entity, OneToMany, ManyToOne } from "typeorm";

import { TimePointEntity } from "../TimePoint";
import { ProjectEntity } from "entities/Project";

@Entity({ name: "goals" })
export class GoalEntity extends BaseGeneratedIDEntity {

  @OneToMany(() => TimePointEntity, (timePoint) => timePoint.goal, { nullable: false })
  timePoint!: TimePointEntity[];

  @ManyToOne(() => ProjectEntity, {onDelete: "CASCADE", nullable: false})
  project!: ProjectEntity;

  @Column()
  name!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column()
  implemented!: boolean;
}
