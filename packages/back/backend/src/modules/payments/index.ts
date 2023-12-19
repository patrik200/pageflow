import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PaymentEntity } from "entities/Payments";

import { CreatePaymentService } from "./services/create";
import { GetExternalPaymentInfoService } from "./services/external/get-info";
import { RefundExternalPaymentService } from "./services/external/refund";
import { GetPaymentService } from "./services/get";
import { PaymentsListenerService } from "./services/background/payments-listener";
import { CreateExternalPaymentService } from "./services/external/create";
import { PaymentsCancellerService } from "./services/background/payments-canceller";
import { DeletePaymentService } from "./services/delete";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity])],
  providers: [
    CreatePaymentService,
    GetPaymentService,
    GetExternalPaymentInfoService,
    RefundExternalPaymentService,
    PaymentsListenerService,
    CreateExternalPaymentService,
    PaymentsCancellerService,
    DeletePaymentService,
  ],
  exports: [CreatePaymentService, GetPaymentService, DeletePaymentService],
})
export class PaymentsModule {}

export * from "./services/create";
export * from "./services/delete";
export * from "./services/get";

export * from "./events/Cancel";
export * from "./events/Complete";
