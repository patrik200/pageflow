import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { ServiceError } from "@app/back-kit";
import { PaymentMode } from "@app/shared-enums";

import { SubscriptionEntity } from "entities/Subscription";

import { CreatePaymentService } from "modules/payments";
import { GetClientsService } from "modules/clients";
import { getCurrentUser } from "modules/auth";

import { getClientDomainByEnv } from "utils/getClientDomainByEnv";

@Injectable()
export class BuySubscriptionService {
  constructor(
    @InjectRepository(SubscriptionEntity) private subscriptionRepository: Repository<SubscriptionEntity>,
    @Inject(forwardRef(() => CreatePaymentService)) private createPaymentService: CreatePaymentService,
    @Inject(forwardRef(() => GetClientsService)) private getClientsService: GetClientsService,
  ) {}

  async buySubscriptionOrFail() {
    const client = await this.getClientsService.getCurrentClientOrFail();

    const subscription = await this.subscriptionRepository.findOneOrFail({
      where: { client: { id: client.id } },
    });

    if (subscription.autoRenewPaymentMethodId) throw new ServiceError("subscription", "Не возможно купить подписку");

    const price = subscription.tariffFixture.price;
    if (price === null) throw new ServiceError("subscription", "Для вашего тарифа нельзя купить подписку");

    return await this.createPaymentService.createPaymentOrFail(
      {
        amount: price,
        subscriptionId: subscription.id,
        description: "Оплата подписки PageFlow на 1 месяц",
        mode: PaymentMode.MANUAL,
        redirectUrl: `${getClientDomainByEnv(client.domain)}/settings?tab=payments`,
      },
      getCurrentUser().userId,
    );
  }
}
