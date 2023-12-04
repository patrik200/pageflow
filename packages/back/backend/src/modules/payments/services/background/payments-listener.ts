import { Injectable, Logger, OnApplicationBootstrap, OnApplicationShutdown } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { config } from "@app/core-config";
import { asyncTimeout, promiseQueue, setAsyncInterval } from "@worksolutions/utils";
import chalk from "chalk";
import { Transactional } from "typeorm-transactional";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { PaymentStatus } from "@app/shared-enums";

import { PaymentEntity } from "entities/Payments";

import { GetExternalPaymentInfoService } from "../external/get-info";
import { AcceptExternalPaymentService } from "../external/accept";
import { CancelExternalPaymentService } from "../external/cancel";
import { GetPaymentService } from "../get";
import { PaymentWaitingForAccept } from "../../events/WaitingForAccept";
import { PaymentComplete } from "../../events/Complete";
import { PaymentCancel } from "../../events/Cancel";

@Injectable()
export class PaymentsListenerService implements OnApplicationBootstrap, OnApplicationShutdown {
  constructor(
    @InjectRepository(PaymentEntity) private paymentRepository: Repository<PaymentEntity>,
    private getExternalPaymentInfoService: GetExternalPaymentInfoService,
    private acceptExternalPaymentService: AcceptExternalPaymentService,
    private cancelExternalPaymentService: CancelExternalPaymentService,
    private getPaymentService: GetPaymentService,
    private eventEmitter: EventEmitter2,
  ) {}

  private loggerContext = "Payments background listener";

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
      await this.paymentRepository.update(payment.id, {
        status: PaymentStatus.COMPLETED,
        paymentMethodId: externalPayment.paymentMethodId,
      });

      this.eventEmitter.emit(PaymentComplete.eventName, new PaymentComplete(payment.id));

      return;
    }

    if (externalPayment.status === "waiting_for_accept") {
      const results = await this.eventEmitter.emitAsync(
        PaymentWaitingForAccept.eventName,
        new PaymentWaitingForAccept(payment.id),
      );

      if (results.some((result) => result !== "ok")) {
        await this.cancelExternalPaymentService.cancelPaymentOrFail(payment.id);
        return;
      }

      await this.acceptExternalPaymentService.acceptPaymentOrFail(payment.id);
      return;
    }
  }

  private async checkPayments() {
    const payments = await this.getPaymentService.dangerGetPaymentsList([
      PaymentStatus.WAITING_FOR_PAYMENT,
      PaymentStatus.WAITING_FOR_ACCEPT,
    ]);

    await Promise.all(payments.map((payment) => this.queue(() => this.checkPayment(payment))));
  }

  private disposeTimer: Function | undefined;
  private async run() {
    await asyncTimeout(50);
    await this.checkPayments();
    Logger.log(
      `Run checking with interval [${chalk.cyan(`${config.payments.checkNewPaymentsIntervalMs}ms`)}]`,
      this.loggerContext,
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
