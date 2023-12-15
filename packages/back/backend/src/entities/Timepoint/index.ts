import { BaseGeneratedIDEntity } from "@app/back-kit";
import { Column, Entity, ManyToOne } from "typeorm";
import { GoalEntity } from "../Goal";

@Entity({ name: "goal_time_points" })
export class TimepointEntity extends BaseGeneratedIDEntity {
    @ManyToOne(() => GoalEntity, { onDelete: "CASCADE" })
    goal!: GoalEntity;

    @Column()
    name!: string;

    @Column({ type: "text", nullable: true })
    description!: string | null;

    @Column({ type: "timestamptz" })
    datePlan!: Date;

    remainingDays!: number;
}
