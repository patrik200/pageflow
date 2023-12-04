import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { BaseGeneratedIDEntity, countWeekendDays } from "@app/back-kit";
import { DateTime } from "luxon";

import { ClientEntity } from "entities/Client";

import { DocumentRevisionResponsibleUserFlowRowEntity } from "./Row";
import { DocumentRevisionResponsibleUserFlowReviewerEntity } from "./Reviewer";
import { DocumentRevisionEntity } from "../../index";

@Entity({ name: "document_revision_responsible_user_flows" })
export class DocumentRevisionResponsibleUserFlowEntity extends BaseGeneratedIDEntity {
  @ManyToOne(() => ClientEntity, { nullable: false })
  client!: ClientEntity;

  @OneToOne(() => DocumentRevisionEntity, (revision) => revision.responsibleUserFlowApproving, { nullable: false })
  revision!: DocumentRevisionEntity;

  @Column()
  name!: string;

  @Column({ type: "int", nullable: true }) deadlineDaysAmount!: number | null;

  @Column({ type: "boolean", default: false }) deadlineDaysIncludeWeekends!: boolean | null;

  @Column({ type: "boolean", default: false }) deadlineDaysNotified!: boolean | null;

  get deadlineDate() {
    if (this.deadlineDaysAmount === null) return null;
    const deadlineDate = DateTime.fromJSDate(this.revision.statusChangeDate).plus({ day: this.deadlineDaysAmount });
    if (this.deadlineDaysIncludeWeekends) return deadlineDate.toJSDate();
    const weekendDays = countWeekendDays(this.revision.statusChangeDate, deadlineDate.toJSDate());
    return deadlineDate.minus({ days: weekendDays }).toJSDate();
  }

  @Column({ type: "timestamptz", nullable: true }) approvedDate!: Date | null;

  @JoinColumn()
  @OneToOne(() => DocumentRevisionResponsibleUserFlowReviewerEntity, (reviewer) => reviewer.userFlow, {
    nullable: true,
    onDelete: "SET NULL",
  })
  reviewer!: DocumentRevisionResponsibleUserFlowReviewerEntity | null;

  @OneToMany(() => DocumentRevisionResponsibleUserFlowRowEntity, (row) => row.userFlow)
  rows!: DocumentRevisionResponsibleUserFlowRowEntity[];

  rowsApproved: boolean | null = null;

  approved: boolean | null = null;
}
