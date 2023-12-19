import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SubscriptionEntity } from "entities/Subscription";
import { ClientEntity } from "entities/Client";

import { LandingController } from "./controllers";

import { CreateAdminLandingService } from "./services/admin/create";
import { CreateClientLandingService } from "./services/client/create";
import { ValidateDomainLandingService } from "./services/domain/validate";
import { SendEmailLandingService } from "./services/email/send";
import { GetTariffsLandingService } from "./services/tariffs/create";
import { LandingSubscriptionPaymentListenerService } from "./services/client/background/subscription-payment-listener";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionEntity, ClientEntity])],
  controllers: [LandingController],
  providers: [
    CreateAdminLandingService,
    CreateClientLandingService,
    ValidateDomainLandingService,
    SendEmailLandingService,
    GetTariffsLandingService,
    LandingSubscriptionPaymentListenerService,
  ],
})
export class LandingModule {}
