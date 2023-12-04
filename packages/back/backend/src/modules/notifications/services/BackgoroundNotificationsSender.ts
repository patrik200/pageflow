import { forwardRef, Inject, Injectable, Logger, OnApplicationBootstrap, OnApplicationShutdown } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { config } from "@app/core-config";
import { isDateBefore, isDeepEqual, setAsyncInterval } from "@worksolutions/utils";
import chalk from "chalk";
import { DateTime } from "luxon";

import { QueueNotificationEntity, QueueNotificationType } from "entities/Queue/Notification";

import { EmailRendererService, EmailSenderService } from "modules/email";
import { GetUserService } from "modules/users";

import { AppNotification } from "./notification";

@Injectable()
export class BackgroundNotificationsSenderService implements OnApplicationBootstrap, OnApplicationShutdown {
  constructor(
    @InjectRepository(QueueNotificationEntity) private queueRepository: Repository<QueueNotificationEntity>,
    @Inject(forwardRef(() => GetUserService)) private getUserService: GetUserService,
    @Inject(forwardRef(() => EmailRendererService)) private emailRendererService: EmailRendererService,
    @Inject(forwardRef(() => EmailSenderService)) private emailSenderService: EmailSenderService,
  ) {}

  private deleteDuplicatesInQueue(queue: QueueNotificationEntity[]) {
    const newQueue = [...queue];
    queue.forEach((mainItem, index) => {
      const samePayloadItems = queue.filter((searchItem) => isDeepEqual(searchItem.payload, mainItem.payload));
      if (samePayloadItems.length > 2) newQueue[index] = null!;
    });

    return newQueue.filter(Boolean);
  }

  private async checkNotifications() {
    const dbQueue = await this.queueRepository.find({ where: { type: QueueNotificationType.PENDING } });
    const queue = this.deleteDuplicatesInQueue(dbQueue);
    await Promise.all(queue.map((item) => this.sendNotificationIfNeed(item)));
  }

  private needSendNotificationByCreatedAt(entity: QueueNotificationEntity) {
    const createdAtDateTime = DateTime.fromJSDate(entity.createdAt).plus({
      millisecond: config.notifications.checkIntervalMs,
    });
    const nowDateTime = DateTime.now();

    return !isDateBefore({ value: nowDateTime, comparisonWith: createdAtDateTime });
  }

  private async sendNotificationIfNeed(entity: QueueNotificationEntity) {
    if (!this.needSendNotificationByCreatedAt(entity)) return;

    await this.queueRepository.update(entity.id, { type: QueueNotificationType.IN_PROGRESS });

    try {
      const notification = AppNotification.deserialize(entity.payload);
      await this.sendNotification(notification);
      await this.queueRepository.delete(entity.id);
    } catch (e) {
      await this.queueRepository.update(entity.id, { type: QueueNotificationType.ERROR, error: (e as Error).stack });
    }
  }

  private async sendNotification(notification: AppNotification) {
    const emailContent = await this.emailRendererService.renderEmailComponent(
      notification.variantOptions.emailTemplateName,
      notification.clientDomain,
      notification.body,
    );

    const user = await this.getUserService.getUser(notification.targetUserId, "id", { unsafe: true });
    if (!user) return;

    await this.emailSenderService.send({
      html: emailContent,
      subject: notification.title,
      targetEmail: user.email,
    });
  }

  private disposeTimer: Function | undefined;
  private async run() {
    if (!config.notifications.enabled) return;
    await this.checkNotifications();
    Logger.log(
      `Run checking with interval [${chalk.cyan(`${config.notifications.checkIntervalMs}ms`)}]`,
      "Background notifications sender",
    );
    this.disposeTimer = setAsyncInterval(() => this.checkNotifications(), config.notifications.checkIntervalMs);
  }

  onApplicationBootstrap() {
    void this.run();
  }

  onApplicationShutdown() {
    this.disposeTimer?.();
  }
}
