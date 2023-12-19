import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

import { SubscriptionEntity } from "entities/Subscription";

@Injectable()
export class DeleteSubscriptionService {
  constructor(@InjectRepository(SubscriptionEntity) private subscriptionRepository: Repository<SubscriptionEntity>) {}

  async dangerDeleteSubscriptionOrFail(subscriptionId: string) {
    return await this.subscriptionRepository.delete(subscriptionId);
  }
}
