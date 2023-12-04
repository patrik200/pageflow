import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { forwardRef, Inject, Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { DateTime } from "luxon";
import { Transactional } from "typeorm-transactional";
import { isDateBefore } from "@worksolutions/utils";

import { SubscriptionEntity } from "entities/Subscription";

import { GetPaymentService, PaymentComplete, PaymentWaitingForAccept, PaymentCancel } from "modules/payments";

@Injectable()
export class SubscriptionPaymentsEventListenerService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(SubscriptionEntity) private subscriptionRepository: Repository<SubscriptionEntity>,
    @Inject(forwardRef(() => GetPaymentService)) private getPaymentService: GetPaymentService,
    private eventEmitter: EventEmitter2,
  ) {}

  private async getPaymentAndSubscription(paymentId: string) {
    const payment = await this.getPaymentService.dangerGetPayment(paymentId, {
      loadClient: true,
    });

    const subscription = await this.subscriptionRepository.findOneOrFail({
      where: { client: { id: payment.client.id } },
    });

    return { payment, subscription };
  }

  @Transactional()
  private async handlePaymentWaitingForAccept(event: PaymentWaitingForAccept) {
    const { subscription } = await this.getPaymentAndSubscription(event.paymentId);

    if (!subscription.payedUntil) throw new Error("В подписке " + subscription.id + " нет даты оплаты");

    const payedUntil = DateTime.fromJSDate(subscription.payedUntil);
    const now = DateTime.now();

    if (isDateBefore({ value: now, comparisonWith: payedUntil })) {
      await this.subscriptionRepository.update(subscription.id, {
        payedUntil: payedUntil.plus({ month: 1 }).toJSDate(),
      });
      return event.ok;
    }

    await this.subscriptionRepository.update(subscription.id, {
      payedUntil: now.plus({ month: 1 }).toJSDate(),
    });

    return event.ok;
  }

  @Transactional()
  private async handlePaymentComplete(event: PaymentComplete) {
    const { payment, subscription } = await this.getPaymentAndSubscription(event.paymentId);

    if (subscription.autoRenewPaymentMethodId === payment.paymentMethodId) return;

    await this.subscriptionRepository.update(subscription.id, {
      autoRenewPaymentMethodId: payment.paymentMethodId,
    });
  }

  @Transactional()
  private async handlePaymentCancel(event: PaymentCancel) {
    const { payment, subscription } = await this.getPaymentAndSubscription(event.paymentId);

    if (subscription.autoRenewPaymentMethodId === payment.paymentMethodId) return;

    await this.subscriptionRepository.update(subscription.id, {
      autoRenewPaymentMethodId: payment.paymentMethodId,
    });
  }

  onApplicationBootstrap() {
    this.eventEmitter.on(PaymentWaitingForAccept.eventName, (event: PaymentWaitingForAccept) =>
      this.handlePaymentWaitingForAccept(event).catch(() => null),
    );
    this.eventEmitter.on(PaymentComplete.eventName, (event: PaymentComplete) =>
      this.handlePaymentComplete(event).catch(() => null),
    );
    this.eventEmitter.on(PaymentCancel.eventName, (event: PaymentCancel) =>
      this.handlePaymentCancel(event).catch(() => null),
    );
  }
}
