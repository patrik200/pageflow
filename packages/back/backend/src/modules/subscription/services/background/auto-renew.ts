import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Not, Repository } from "typeorm";
import { forwardRef, Inject, Injectable, Logger, OnApplicationBootstrap, OnApplicationShutdown } from "@nestjs/common";
import { Transactional } from "typeorm-transactional";
import chalk from "chalk";
import { config } from "@app/core-config";
import { asyncTimeout, setAsyncInterval } from "@worksolutions/utils";
import { SentryTextService } from "@app/back-kit";
import { DateTime } from "luxon";
import { PaymentMode } from "@app/shared-enums";

import { SubscriptionEntity } from "entities/Subscription";

import { CreatePaymentService, GetPaymentService } from "modules/payments";

@Injectable()
export class SubscriptionAutoRenewService implements OnApplicationBootstrap, OnApplicationShutdown {
  constructor(
    @InjectRepository(SubscriptionEntity) private subscriptionRepository: Repository<SubscriptionEntity>,
    @Inject(forwardRef(() => CreatePaymentService)) private createPaymentService: CreatePaymentService,
    @Inject(forwardRef(() => GetPaymentService)) private getPaymentService: GetPaymentService,
    private sentryTextService: SentryTextService,
  ) {}

  @Transactional()
  private async checkSubscription(subscription: SubscriptionEntity) {
    if (!subscription.payedUntil) return;
    if (!subscription.autoRenewPaymentMethodId) return;
    if (!subscription.pureActive) return;

    const diffNow = DateTime.fromJSDate(subscription.payedUntil).diffNow("minutes");
    if (diffNow.minutes > 10) return;

    const price = subscription.tariffFixture.price;
    if (price === null) return;

    const lastPayment = await this.getPaymentService.dangerGetLastPayment(subscription.id, { loadAuthor: true });

    if (!lastPayment) return;
    if (lastPayment.paymentInProgress) return;

    await this.createPaymentService.createPaymentOrFail(
      {
        amount: subscription.tariffFixture.price,
        subscriptionId: subscription.id,
        description: "Продление подписки PageFlow на 1 месяц",
        mode: PaymentMode.AUTOMATIC,
        paymentMethodId: subscription.autoRenewPaymentMethodId,
      },
      lastPayment.author.id,
    );
  }

  private async checkSubscriptions() {
    const subscriptions = await this.subscriptionRepository.find({
      where: { autoRenewPaymentMethodId: Not(IsNull()) },
      relations: { client: true },
    });

    for (const subscription of subscriptions) {
      try {
        await this.checkSubscription(subscription);
      } catch (e) {
        this.sentryTextService.error(e, {
          context: "check subscription",
          contextService: SubscriptionAutoRenewService.name,
        });
      }
    }
  }

  private disposeTimer: Function | undefined;
  private async run() {
    await asyncTimeout(50);
    await this.checkSubscriptions();
    Logger.log(
      `Run checking with interval [${chalk.cyan(`${config.subscription.checkForAutoRenewIntervalMs}ms`)}]`,
      SubscriptionAutoRenewService.name,
    );
    this.disposeTimer = setAsyncInterval(
      () => this.checkSubscriptions(),
      config.subscription.checkForAutoRenewIntervalMs,
    );
  }

  onApplicationBootstrap() {
    void this.run();
  }

  onApplicationShutdown() {
    this.disposeTimer?.();
  }
}
