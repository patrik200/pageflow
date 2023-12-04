import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

import { SubscriptionEntity } from "entities/Subscription";

import { getCurrentUser } from "modules/auth";

@Injectable()
export class CancelSubscriptionService {
  constructor(@InjectRepository(SubscriptionEntity) private subscriptionRepository: Repository<SubscriptionEntity>) {}

  async cancelSubscriptionOrFail() {
    const subscription = await this.subscriptionRepository.findOneOrFail({
      where: { client: { id: getCurrentUser().clientId } },
    });

    await this.subscriptionRepository.update(subscription.id, {
      autoRenewPaymentMethodId: null,
    });
  }
}
