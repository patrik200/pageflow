import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { BaseGeneratedIDEntity } from "@app/back-kit";
import { UserRole } from "@app/shared-enums";

import { ClientEntity } from "entities/Client";
import { UserEntity } from "entities/User";

import { UserFlowRowEntity } from "./Row";
import { UserFlowReviewerEntity } from "./Reviewer";

@Entity({ name: "user_flow" })
export class UserFlowEntity extends BaseGeneratedIDEntity {
  @ManyToOne(() => UserEntity, { nullable: false }) author!: UserEntity;

  @JoinColumn()
  @OneToOne(() => UserFlowReviewerEntity, (reviewer) => reviewer.userFlow, { nullable: true, onDelete: "SET NULL" })
  reviewer!: UserFlowReviewerEntity | null;

  @Column({ unique: true }) name!: string;

  @Column({ type: "int", nullable: true }) deadlineDaysAmount!: number | null;

  @Column({ default: false }) deadlineDaysIncludeWeekends!: boolean;

  @ManyToOne(() => ClientEntity, { onDelete: "CASCADE", nullable: false }) client!: ClientEntity;

  @OneToMany(() => UserFlowRowEntity, (row) => row.userFlow) rows!: UserFlowRowEntity[];

  canUpdate!: boolean | undefined;

  calculateCanUpdate(currentUser: { userId: string; role: UserRole }) {
    if (currentUser.role === UserRole.ADMIN) {
      this.canUpdate = true;
      return;
    }

    if (currentUser.userId === this.author.id) {
      this.canUpdate = true;
      return;
    }

    this.canUpdate = false;
  }

  calculateAllCans(currentUser: { userId: string; role: UserRole }) {
    this.calculateCanUpdate(currentUser);
  }
}
