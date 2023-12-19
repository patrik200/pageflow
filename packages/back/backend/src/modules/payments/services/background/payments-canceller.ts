import { Injectable, Logger, OnApplicationBootstrap, OnApplicationShutdown } from "@nestjs/common";
import { config } from "@app/core-config";
import { asyncTimeout, isDateBefore, setAsyncInterval } from "@worksolutions/utils";
import chalk from "chalk";
import { Transactional } from "typeorm-transactional";
import { PaymentStatus } from "@app/shared-enums";
import { DateTime } from "luxon";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { SentryTextService } from "@app/back-kit";

import { PaymentEntity } from "entities/Payments";

import { GetPaymentService } from "../get";
import { PaymentCancel } from "../../events/Cancel";

@Injectable()
export class PaymentsCancellerService implements OnApplicationBootstrap, OnApplicationShutdown {
  constructor(
    @InjectRepository(PaymentEntity) private paymentRepository: Repository<PaymentEntity>,
    private getPaymentService: GetPaymentService,
    private eventEmitter: EventEmitter2,
    private sentryTextService: SentryTextService,
  ) {}

  @Transactional()
  private async checkPayment(payment: PaymentEntity) {
    const now = DateTime.now();
    const createdAt = DateTime.fromJSDate(payment.createdAt);
    if (isDateBefore({ value: now, comparisonWith: createdAt.plus({ minute: 10 }) })) return;
    await this.paymentRepository.update(payment.id, { status: PaymentStatus.CANCELED, confirmationUrl: null });
    this.eventEmitter.emit(PaymentCancel.eventName, new PaymentCancel(payment.id));
  }

  private async checkPayments() {
    const payments = await this.getPaymentService.dangerGetPaymentsListInStatuses([PaymentStatus.WAITING_FOR_PAYMENT]);
    for (const payment of payments) {
      try {
        await this.checkPayment(payment);
      } catch (e) {
        this.sentryTextService.error(e, {
          context: "Check payment",
          contextService: PaymentsCancellerService.name,
        });
      }
    }
  }

  private disposeTimer: Function | undefined;
  private async run() {
    await asyncTimeout(50);
    await this.checkPayments();
    Logger.log(
      `Run checking with interval [${chalk.cyan(`${config.payments.checkForCancelIntervalMs}ms`)}]`,
      PaymentsCancellerService.name,
    );
    this.disposeTimer = setAsyncInterval(() => this.checkPayments(), config.payments.checkForCancelIntervalMs);
  }

  onApplicationBootstrap() {
    void this.run();
  }

  onApplicationShutdown() {
    this.disposeTimer?.();
  }
}
