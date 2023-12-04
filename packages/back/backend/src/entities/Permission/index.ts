import { BaseGeneratedIDEntity } from "@app/back-kit";
import { PermissionEntityType, PermissionRole } from "@app/shared-enums";
import { Column, Entity, Index, ManyToOne, Unique } from "typeorm";

import { UserEntity } from "entities/User";
import { ClientEntity } from "entities/Client";

@Entity({ name: "permissions" })
@Unique(["user", "entityId", "entityType"])
export class PermissionEntity extends BaseGeneratedIDEntity {
  @ManyToOne(() => UserEntity, { onDelete: "CASCADE", nullable: false })
  user!: UserEntity;

  @ManyToOne(() => ClientEntity, { onDelete: "CASCADE", nullable: false })
  client!: ClientEntity;

  @Index()
  @Column()
  entityId!: string;

  @Column({ type: "enum", enum: PermissionEntityType })
  entityType!: PermissionEntityType;

  @Column({ type: "enum", enum: PermissionRole, nullable: false })
  role!: PermissionRole;

  @Column({ nullable: true })
  canEditEditorPermissions?: boolean;

  @Column({ nullable: true })
  canEditReaderPermissions?: boolean;
}
