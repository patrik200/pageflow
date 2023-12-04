import { BaseGeneratedIDEntity } from "@app/back-kit";
import { ChangeFeedEntityType } from "@app/shared-enums";
import { Column, Entity, Index, ManyToOne } from "typeorm";

import { UserEntity } from "entities/User";
import { ClientEntity } from "entities/Client";

@Entity({ name: "change_feed_events" })
export class ChangeFeedEventEntity extends BaseGeneratedIDEntity {
  @ManyToOne(() => UserEntity, { onDelete: "CASCADE", nullable: false })
  author!: UserEntity;

  @ManyToOne(() => ClientEntity, { onDelete: "CASCADE", nullable: false })
  client!: ClientEntity;

  @Index()
  @Column()
  entityId!: string;

  @Column({ type: "enum", enum: ChangeFeedEntityType })
  entityType!: ChangeFeedEntityType;

  @Column()
  eventType!: string;

  @Column({ type: "jsonb" })
  data!: object;
}
