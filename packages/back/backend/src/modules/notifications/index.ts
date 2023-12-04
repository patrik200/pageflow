import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { QueueNotificationEntity } from "entities/Queue/Notification";

import { NotificationService } from "./services/notification";
import { BackgroundNotificationsSenderService } from "./services/BackgoroundNotificationsSender";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([QueueNotificationEntity])],
  providers: [NotificationService, BackgroundNotificationsSenderService],
  exports: [NotificationService],
})
export class NotificationsModule {}

export * from "./services/notification";
