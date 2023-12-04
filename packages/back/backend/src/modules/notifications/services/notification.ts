import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { config } from "@app/core-config";

import { QueueNotificationEntity } from "entities/Queue/Notification";

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(QueueNotificationEntity) private queueRepository: Repository<QueueNotificationEntity>,
  ) {}

  async queueNotify(notification: AppNotification) {
    if (!config.notifications.enabled) return;
    await this.queueRepository.save({ payload: notification._serialize() });
    return notification.targetUserId;
  }

  notifyUserFabric(notification: AppNotification, triggerUserId?: string) {
    const notifiedUsers = new Set<string>();
    return async (userId: string) => {
      if (userId === triggerUserId) return;
      if (notifiedUsers.has(userId)) return;
      notifiedUsers.add(userId);
      await this.queueNotify(notification.cloneWithNewTargetUserId(userId));
    };
  }
}

export class AppNotification {
  static deserialize(object: Record<string, any>) {
    if (object.title && object.body && object.variantOptions && object.clientDomain && object.targetUserId)
      return new AppNotification(
        object.title,
        object.body,
        object.variantOptions,
        object.clientDomain,
        object.targetUserId,
      );

    throw new Error("Bad object");
  }

  constructor(
    public title: string,
    public body: Record<string, any>,
    public variantOptions: { emailTemplateName: string },
    public clientDomain: string,
    public targetUserId: string,
  ) {}

  cloneWithNewTargetUserId(targetUserId: string) {
    return new AppNotification(this.title, this.body, this.variantOptions, this.clientDomain, targetUserId);
  }

  _serialize() {
    return {
      title: this.title,
      body: this.body,
      variantOptions: this.variantOptions,
      clientDomain: this.clientDomain,
      targetUserId: this.targetUserId,
    };
  }
}
