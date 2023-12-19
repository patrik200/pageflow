import { BaseGeneratedIDEntity, StorageFileEntity } from "@app/back-kit";
import { AfterLoad, Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { UserRole } from "@app/shared-enums";

import { ContractorEntity } from "entities/Contractor";
import { ProjectEntity } from "entities/Project";
import { UserEntity } from "entities/User";
import { UserFlowEntity } from "entities/UserFlow";

import { SubscriptionEntity } from "../Subscription";

@Entity({ name: "clients" })
export class ClientEntity extends BaseGeneratedIDEntity {
  @Column()
  name!: string;

  @Column({ unique: true })
  domain!: string;

  @Column({ type: "bigint", default: 0 })
  usedFileSizeByte!: number;

  @Column({ type: "bigint", nullable: true })
  filesMemoryLimitByte!: number | null;

  @Column({ type: "boolean", default: false })
  readOnlyMode!: boolean;

  @OneToMany(() => UserEntity, (user) => user.client)
  users!: UserEntity[];

  @OneToMany(() => UserFlowEntity, (userFlow) => userFlow.client)
  userFlows!: UserFlowEntity[];

  // @OneToMany(() => WorkGroupEntity, (workGroup) => workGroup.client) workGroups!: WorkGroupEntity[];

  @OneToMany(() => ContractorEntity, (contractor) => contractor.client)
  contractors!: ContractorEntity[];

  @OneToMany(() => ProjectEntity, (project) => project.client)
  projects!: ProjectEntity[];

  @JoinColumn()
  @OneToOne(() => StorageFileEntity, { nullable: true, onDelete: "SET NULL" })
  logo!: StorageFileEntity | null;

  @OneToOne(() => SubscriptionEntity, { nullable: true, onDelete: "SET NULL" })
  subscription!: SubscriptionEntity;

  @Column({ default: 0 })
  createdProjectsCount!: number;

  @AfterLoad()
  private parseMemoryLimit() {
    if (this.filesMemoryLimitByte) this.filesMemoryLimitByte = +this.filesMemoryLimitByte;
    this.usedFileSizeByte = +this.usedFileSizeByte;
  }

  canUpdate: boolean | null = null;

  calculateCanUpdate(currentUser: { userId: string; role: UserRole }) {
    if (currentUser.role === UserRole.ADMIN) {
      this.canUpdate = true;
      return;
    }

    this.canUpdate = false;
  }

  calculateAllCans(currentUser: { userId: string; role: UserRole }) {
    this.calculateCanUpdate(currentUser);
  }
}
