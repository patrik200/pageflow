import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne, Unique } from "typeorm";
import { BaseGeneratedIDEntity, StorageFileEntity } from "@app/back-kit";
import { UserRole } from "@app/shared-enums";

import { ClientEntity } from "../Client";

@Entity({ name: "users" })
@Unique("user_email", ["client", "email"])
export class UserEntity extends BaseGeneratedIDEntity {
  @ManyToOne(() => ClientEntity, { onDelete: "CASCADE" }) client!: ClientEntity;

  @Column() email!: string;

  @Column({ select: false }) passwordHash!: string;

  @Column({ enum: UserRole }) role!: UserRole;

  @Index() @Column() name!: string;

  @Column({ default: false, select: false }) system!: boolean;

  @Column({ type: "varchar", nullable: true }) position!: string | null;

  @Column({ type: "varchar", nullable: true }) phone!: string | null;

  @JoinColumn()
  @OneToOne(() => StorageFileEntity, { nullable: true, onDelete: "SET NULL" })
  avatar!: StorageFileEntity | null;

  @Column({ type: "timestamptz", nullable: true }) unavailableUntil!: Date | null;

  canUpdate!: boolean;

  calculateCanUpdate(currentUser: { userId: string; role: UserRole }) {
    if (currentUser.role === UserRole.ADMIN) {
      this.canUpdate = true;
      return;
    }

    if (this.id === currentUser.userId) {
      this.canUpdate = true;
      return;
    }

    this.canUpdate = false;
  }

  canDelete!: boolean;
  calculateCanDelete(currentUser: { userId: string; role: UserRole }) {
    if (currentUser.userId === this.id) {
      this.canDelete = false;
      return;
    }

    if (this.deletedAt) {
      this.canDelete = false;
      return;
    }

    if (currentUser.role === UserRole.ADMIN) {
      this.canDelete = true;
      return;
    }

    this.canDelete = false;
  }

  canRestore!: boolean;
  calculateCanRestore(currentUser: { userId: string; role: UserRole }) {
    if (currentUser.userId === this.id) {
      this.canRestore = false;
      return;
    }

    if (!this.deletedAt) {
      this.canRestore = false;
      return;
    }

    if (currentUser.role === UserRole.ADMIN) {
      this.canRestore = true;
      return;
    }

    this.canRestore = false;
  }

  calculateAllCans(currentUser: { userId: string; role: UserRole }) {
    this.calculateCanUpdate(currentUser);
    this.calculateCanDelete(currentUser);
    this.calculateCanRestore(currentUser);
  }

  // @ManyToMany(() => WorkGroupEntity) workGroups!: WorkGroupEntity[];

  // @OneToMany(() => WorkGroupEntity, (supervisorWorkGroup) => supervisorWorkGroup.supervisor)
  // supervisorWorkGroups!: WorkGroupEntity[];
}
