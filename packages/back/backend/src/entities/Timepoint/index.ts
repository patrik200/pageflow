import { BaseGeneratedIDEntity } from "@app/back-kit";
import { Column, Entity, ManyToOne } from "typeorm";
import { GoalEntity } from "../Goal";

@Entity({ name: "goals_time_point" })
export class TimepointEntity extends BaseGeneratedIDEntity {
    @ManyToOne(() => GoalEntity, { nullable: false })
    goal!: GoalEntity;

    @Column()
    name!: string;

    @Column({ type: "text", nullable: true })
    description!: string | null;

    @Column({ type: "timestamptz", nullable: false })
    datePlan!: Date;
}
