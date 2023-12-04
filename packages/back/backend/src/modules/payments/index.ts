import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PaymentEntity } from "entities/Payments";

import { CreatePaymentService } from "./services/create";
import { GetExternalPaymentInfoService } from "./services/external/get-info";
import { AcceptExternalPaymentService } from "./services/external/accept";
import { CancelExternalPaymentService } from "./services/external/cancel";
import { GetPaymentService } from "./services/get";
import { PaymentsListenerService } from "./services/background/payments-listener";
import { CreateExternalPaymentService } from "./services/external/create";
import { PaymentsCancellerService } from "./services/background/payments-canceller";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity])],
  providers: [
    CreatePaymentService,
    GetPaymentService,
    GetExternalPaymentInfoService,
    AcceptExternalPaymentService,
    CancelExternalPaymentService,
    PaymentsListenerService,
    CreateExternalPaymentService,
    PaymentsCancellerService,
  ],
  exports: [CreatePaymentService, GetPaymentService],
})
export class PaymentsModule {}

export * from "./services/create";
export * from "./services/get";

export * from "./events/Cancel";
export * from "./events/Complete";
export * from "./events/WaitingForAccept";
