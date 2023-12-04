import { Column, Entity, Index } from "typeorm";
import { BaseGeneratedIDEntity } from "@app/back-kit";

export enum QueueNotificationType {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  ERROR = "error",
}

@Entity({ name: "queue_notifications" })
export class QueueNotificationEntity extends BaseGeneratedIDEntity {
  @Index()
  @Column({ type: "enum", enum: QueueNotificationType, default: QueueNotificationType.PENDING })
  type!: QueueNotificationType;

  @Column({ type: "json" }) payload!: Record<string, any>;

  @Column({ type: "text", nullable: true }) error?: string;
}
