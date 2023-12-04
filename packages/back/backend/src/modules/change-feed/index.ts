import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ChangeFeedEventEntity } from "entities/ChangeFeed";

import { ChangeFeedController } from "./controller";

import { CreateChangeFeedEventService } from "./services/create";
import { DeleteChangeFeedEventService } from "./services/delete";
import { ChangeFeedEventChangeDetectionService } from "./services/change-detection";
import { GetChangeFeedEventsService } from "./services/get-feed-events";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ChangeFeedEventEntity])],
  controllers: [ChangeFeedController],
  providers: [
    CreateChangeFeedEventService,
    DeleteChangeFeedEventService,
    ChangeFeedEventChangeDetectionService,
    GetChangeFeedEventsService,
  ],
  exports: [
    CreateChangeFeedEventService,
    DeleteChangeFeedEventService,
    ChangeFeedEventChangeDetectionService,
    GetChangeFeedEventsService,
  ],
})
export class ChangeFeedModule {}

export * from "./dto/ChangeFeedEvent";

export * from "./services/change-detection";
export * from "./services/create";
export * from "./services/delete";
export * from "./services/get-feed-events";
