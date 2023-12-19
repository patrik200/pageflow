import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { DateTime } from "luxon";

import { SubscriptionEntity } from "entities/Subscription";

import { Tariffs } from "fixtures/tariffs";

@Injectable()
export class CreateSubscriptionService {
  constructor(@InjectRepository(SubscriptionEntity) private subscriptionRepository: Repository<SubscriptionEntity>) {}

  private getInitialPayedUntil(options: { tariff: Tariffs; addTrial?: boolean }) {
    if (options.tariff === Tariffs.ON_PREMISE) return null;
    if (options.tariff === Tariffs.START) {
      if (options.addTrial) return DateTime.now().plus({ month: 1 }).toJSDate();
      return DateTime.now().toJSDate();
    }

    throw new Error("Unknown tariff");
  }

  async dangerCreateSubscriptionOrFail(options: { clientId: string; tariff: Tariffs; addTrial?: boolean }) {
    return await this.subscriptionRepository.save({
      client: { id: options.clientId },
      tariff: options.tariff,
      payedUntil: this.getInitialPayedUntil(options),
    });
  }
}
