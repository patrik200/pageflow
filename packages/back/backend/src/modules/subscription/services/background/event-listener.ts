import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { forwardRef, Inject, Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { DateTime } from "luxon";
import { Transactional } from "typeorm-transactional";
import { isDateBefore } from "@worksolutions/utils";
import { SentryTextService, TypeormUpdateEntity } from "@app/back-kit";

import { SubscriptionEntity } from "entities/Subscription";

import { GetPaymentService, PaymentCancel, PaymentComplete } from "modules/payments";

import { SubscriptionPayedAtLeastOneTimeUpdated } from "../../events/PayedAtLeastOneTime";

@Injectable()
export class SubscriptionPaymentsEventListenerService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(SubscriptionEntity) private subscriptionRepository: Repository<SubscriptionEntity>,
    @Inject(forwardRef(() => GetPaymentService)) private getPaymentService: GetPaymentService,
    private eventEmitter: EventEmitter2,
    private sentryTextService: SentryTextService,
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
  private async handlePaymentComplete(event: PaymentComplete) {
    const { payment, subscription } = await this.getPaymentAndSubscription(event.paymentId);

    if (!subscription.payedUntil) throw new Error("В подписке " + subscription.id + " нет даты оплаты");

    const payedUntil = DateTime.fromJSDate(subscription.payedUntil);
    const now = DateTime.now();

    const updateOptions: TypeormUpdateEntity<SubscriptionEntity> = {};

    if (isDateBefore({ value: now, comparisonWith: payedUntil })) {
      updateOptions.payedUntil = payedUntil.plus({ month: 1 }).toJSDate();
    } else {
      updateOptions.payedUntil = now.plus({ month: 1 }).toJSDate();
    }

    if (!subscription.payedAtLeastOneTime) {
      updateOptions.payedAtLeastOneTime = true;
    }

    if (subscription.autoRenewPaymentMethodId !== payment.paymentMethodId) {
      updateOptions.autoRenewPaymentMethodId = payment.paymentMethodId;
    }

    await this.subscriptionRepository.update(subscription.id, updateOptions);

    if (updateOptions.payedAtLeastOneTime) {
      this.eventEmitter.emit(
        SubscriptionPayedAtLeastOneTimeUpdated.eventName,
        new SubscriptionPayedAtLeastOneTimeUpdated(subscription.id),
      );
    }

    return event.ok;
  }

  @Transactional()
  private async handlePaymentCancel() {}

  onApplicationBootstrap() {
    this.eventEmitter.on(PaymentComplete.eventName, (event: PaymentComplete) =>
      this.handlePaymentComplete(event).catch((e) => {
        this.sentryTextService.error(e, {
          context: PaymentComplete.eventName,
          contextService: SubscriptionPaymentsEventListenerService.name,
        });
        return event.notOk;
      }),
    );
    this.eventEmitter.on(PaymentCancel.eventName, () =>
      this.handlePaymentCancel().catch((e) =>
        this.sentryTextService.error(e, {
          context: PaymentCancel.eventName,
          contextService: SubscriptionPaymentsEventListenerService.name,
        }),
      ),
    );
  }
}
