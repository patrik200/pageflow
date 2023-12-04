import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { BaseGeneratedIDEntity, StorageFileEntity } from "@app/back-kit";
import { ProjectsStatus, UserRole } from "@app/shared-enums";

import { ClientEntity } from "entities/Client";
import { UserEntity } from "entities/User";
import { ContractorEntity } from "entities/Contractor";
import { TicketBoardEntity } from "entities/TicketBoard";
import { CorrespondenceRootGroupEntity } from "entities/Correspondence/Group/rootGroup";
import { DocumentRootGroupEntity } from "entities/Document/Group/rootGroup";
import { PermissionEntity } from "entities/Permission";

import { ProjectFavouriteEntity } from "./Favourite";
import { GoalEntity } from "entities/Goal/Goal";

@Entity({ name: "projects" })
export class ProjectEntity extends BaseGeneratedIDEntity {
  @ManyToOne(() => ClientEntity, { onDelete: "CASCADE" }) client!: ClientEntity;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE", nullable: false }) author!: UserEntity;

  @Column() name!: string;

  @Column({ type: "text", nullable: true }) description!: string | null;

  @Column({ type: "enum", enum: ProjectsStatus, default: ProjectsStatus.IN_PROGRESS })
  status!: ProjectsStatus;

  @Column({ type: "int", default: 0 }) updateCount!: number;

  @JoinColumn()
  @OneToOne(() => StorageFileEntity, { nullable: true, onDelete: "SET NULL" })
  preview!: StorageFileEntity | null;

  @Column({ default: false })
  isPrivate!: boolean;

  @Column({ type: "timestamptz", nullable: true }) startDatePlan!: Date | null;

  @Column({ type: "timestamptz", nullable: true }) startDateForecast!: Date | null;

  @Column({ type: "timestamptz", nullable: true }) startDateFact!: Date | null;

  @Column({ type: "timestamptz", nullable: true }) endDatePlan!: Date | null;

  @Column({ type: "timestamptz", nullable: true }) endDateForecast!: Date | null;

  @Column({ type: "timestamptz", nullable: true }) endDateFact!: Date | null;

  @Column({ type: "int", nullable: true }) notifyInDays!: number | null;

  @Column({ default: false }) notifiedInDays!: boolean;

  @Column({ default: false }) notifiedAfterEndDatePlan!: boolean;

  @ManyToOne(() => UserEntity, { nullable: true }) responsible!: UserEntity | null;

  @ManyToOne(() => ContractorEntity, { nullable: true }) contractor!: ContractorEntity | null;

  @JoinColumn()
  @OneToOne(() => CorrespondenceRootGroupEntity, (group) => group.parentProject, {
    nullable: true,
    onDelete: "SET NULL",
  })
  correspondenceRootGroup!: CorrespondenceRootGroupEntity;

  @JoinColumn()
  @OneToOne(() => DocumentRootGroupEntity, (group) => group.parentProject, { nullable: true, onDelete: "SET NULL" })
  documentRootGroup!: DocumentRootGroupEntity;

  @OneToMany(() => GoalEntity, (goal) => goal.project) goals!: GoalEntity[];

  @OneToMany(() => ProjectFavouriteEntity, (favourite) => favourite.project)
  favourites!: ProjectFavouriteEntity[];

  @OneToMany(() => TicketBoardEntity, (board) => board.project) ticketBoards!: TicketBoardEntity[];

  canMoveToCompletedStatus: boolean | null = null;

  calculateCanMoveToCompletedStatus(currentUser: { userId: string; role: UserRole }) {
    if (this.status !== ProjectsStatus.IN_PROGRESS) {
      this.canMoveToCompletedStatus = false;
      return;
    }

    if (currentUser.role === UserRole.ADMIN) {
      this.canMoveToCompletedStatus = true;
      return;
    }

    if (this.author.id === currentUser.userId) {
      this.canMoveToCompletedStatus = true;
      return;
    }

    if (this.responsible !== null && this.responsible.id === currentUser.userId) {
      this.canMoveToCompletedStatus = true;
      return;
    }

    this.canMoveToCompletedStatus = false;
  }

  calculateAllCans(currentUser: { userId: string; role: UserRole }) {
    this.calculateCanMoveToCompletedStatus(currentUser);
  }

  // virtual fields ------
  favourite?: boolean;
  activeTicketsCount?: number;
  permissions?: PermissionEntity[];
}
