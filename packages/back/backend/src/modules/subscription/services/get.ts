import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { forwardRef, Inject, Injectable } from "@nestjs/common";

import { SubscriptionEntity } from "entities/Subscription";

import { getCurrentUser } from "modules/auth";
import { GetPaymentService } from "modules/payments";

@Injectable()
export class GetSubscriptionService {
  constructor(
    @InjectRepository(SubscriptionEntity) private subscriptionRepository: Repository<SubscriptionEntity>,
    @Inject(forwardRef(() => GetPaymentService)) private getPaymentService: GetPaymentService,
  ) {}

  async unsafeGetSubscriptionByClientIdOrFail(clientId: string) {
    return await this.subscriptionRepository.findOneOrFail({
      where: { client: { id: clientId } },
      relations: { client: true },
    });
  }

  private async getCurrentSubscription() {
    return await this.unsafeGetSubscriptionByClientIdOrFail(getCurrentUser().clientId);
  }

  async getSubscriptionInfoForCurrentUser() {
    const subscription = await this.getCurrentSubscription();
    return {
      active: subscription.active,
      autoRenew: subscription.autoRenewPaymentMethodId !== null,
      pricePerMonth: subscription.tariffFixture.price,
      nextPaymentAt: subscription.payedUntil,
    };
  }

  async getPaymentsList() {
    const subscription = await this.getCurrentSubscription();
    return await this.getPaymentService.unsafeGetPaymentsListForSubscription(subscription.id);
  }
}
