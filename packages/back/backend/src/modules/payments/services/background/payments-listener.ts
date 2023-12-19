import { Injectable, Logger, OnApplicationBootstrap, OnApplicationShutdown } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { config } from "@app/core-config";
import { asyncTimeout, promiseQueue, setAsyncInterval } from "@worksolutions/utils";
import chalk from "chalk";
import { Transactional } from "typeorm-transactional";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { PaymentStatus } from "@app/shared-enums";
import { SentryTextService } from "@app/back-kit";

import { PaymentEntity } from "entities/Payments";

import { GetExternalPaymentInfoService } from "../external/get-info";
import { RefundExternalPaymentService } from "../external/refund";
import { GetPaymentService } from "../get";
import { PaymentComplete } from "../../events/Complete";
import { PaymentCancel } from "../../events/Cancel";

@Injectable()
export class PaymentsListenerService implements OnApplicationBootstrap, OnApplicationShutdown {
  constructor(
    @InjectRepository(PaymentEntity) private paymentRepository: Repository<PaymentEntity>,
    private getExternalPaymentInfoService: GetExternalPaymentInfoService,
    private refundExternalPaymentService: RefundExternalPaymentService,
    private getPaymentService: GetPaymentService,
    private eventEmitter: EventEmitter2,
    private sentryTextService: SentryTextService,
  ) {}

  private queue = promiseQueue(3);

  @Transactional()
  private async checkPayment(payment: PaymentEntity) {
    const externalPayment = await this.getExternalPaymentInfoService.getInfoOrFail(payment.externalPaymentId);

    if (externalPayment.status === "canceled") {
      await this.paymentRepository.update(payment.id, {
        status: PaymentStatus.CANCELED,
        confirmationUrl: null,
        paymentMethodId: null,
      });

      this.eventEmitter.emit(PaymentCancel.eventName, new PaymentCancel(payment.id));

      return;
    }

    if (externalPayment.status === "completed") {
      await this.paymentRepository.update(payment.id, { paymentMethodId: externalPayment.paymentMethodId });

      const results = await this.eventEmitter.emitAsync(PaymentComplete.eventName, new PaymentComplete(payment.id));

      if (results.some((result) => result !== "ok")) {
        await this.refundExternalPaymentService.refundPaymentOrFail(payment.id);
        await this.paymentRepository.update(payment.id, { status: PaymentStatus.REFUND, paymentMethodId: null });
        return;
      }

      await this.paymentRepository.update(payment.id, { status: PaymentStatus.COMPLETED });

      return;
    }
  }

  private async checkPayments() {
    const payments = await this.getPaymentService.dangerGetPaymentsListInStatuses([PaymentStatus.WAITING_FOR_PAYMENT]);

    await Promise.all(
      payments.map(async (payment) => {
        try {
          await this.queue(() => this.checkPayment(payment));
        } catch (e) {
          this.sentryTextService.error(e, {
            context: "Check payment",
            contextService: PaymentsListenerService.name,
          });
        }
      }),
    );
  }

  private disposeTimer: Function | undefined;
  private async run() {
    await asyncTimeout(50);
    await this.checkPayments();
    Logger.log(
      `Run checking with interval [${chalk.cyan(`${config.payments.checkNewPaymentsIntervalMs}ms`)}]`,
      PaymentsListenerService.name,
    );
    this.disposeTimer = setAsyncInterval(() => this.checkPayments(), config.payments.checkNewPaymentsIntervalMs);
  }

  onApplicationBootstrap() {
    void this.run();
  }

  onApplicationShutdown() {
    this.disposeTimer?.();
  }
}
