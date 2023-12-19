import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SubscriptionEntity } from "entities/Subscription";

import { SubscriptionController } from "./controllers";

import { BuySubscriptionService } from "./services/buy";
import { CreateSubscriptionService } from "./services/create";
import { GetSubscriptionService } from "./services/get";
import { CancelSubscriptionService } from "./services/cancel";
import { SubscriptionPaymentsEventListenerService } from "./services/background/event-listener";
import { SubscriptionAutoRenewService } from "./services/background/auto-renew";
import { DeleteSubscriptionService } from "./services/delete";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionEntity])],
  controllers: [SubscriptionController],
  providers: [
    GetSubscriptionService,
    CreateSubscriptionService,
    BuySubscriptionService,
    CancelSubscriptionService,
    SubscriptionPaymentsEventListenerService,
    SubscriptionAutoRenewService,
    DeleteSubscriptionService,
  ],
  exports: [
    GetSubscriptionService,
    CreateSubscriptionService,
    BuySubscriptionService,
    CancelSubscriptionService,
    DeleteSubscriptionService,
  ],
})
export class SubscriptionModule {}

export * from "./services/buy";
export * from "./services/cancel";
export * from "./services/create";
export * from "./services/delete";
export * from "./services/get";
