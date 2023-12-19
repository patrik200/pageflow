import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Transactional } from "typeorm-transactional";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SentryTextService } from "@app/back-kit";

import { ClientEntity } from "entities/Client";
import { SubscriptionEntity } from "entities/Subscription";

import { Tariffs } from "fixtures/tariffs";

import { SubscriptionPayedAtLeastOneTimeUpdated } from "modules/subscription/events/PayedAtLeastOneTime";

import { megabyteToByte } from "utils/megabyteToByte";

@Injectable()
export class LandingSubscriptionPaymentListenerService {
  constructor(
    @InjectRepository(SubscriptionEntity) private subscriptionRepository: Repository<SubscriptionEntity>,
    @InjectRepository(ClientEntity) private clientRepository: Repository<ClientEntity>,
    private eventEmitter: EventEmitter2,
    private sentryTextService: SentryTextService,
  ) {}

  @Transactional()
  private async handleSubscriptionPayedAtLeastOneTimeUpdated(event: SubscriptionPayedAtLeastOneTimeUpdated) {
    const subscription = await this.subscriptionRepository.findOneOrFail({
      where: { id: event.subscriptionId },
      relations: { client: true },
    });
    if (subscription.client.filesMemoryLimitByte === null) return;
    if (subscription.tariff !== Tariffs.START) return;
    await this.clientRepository.update(subscription.client.id, {
      filesMemoryLimitByte: () => `filesMemoryLimitByte + ${megabyteToByte(850) + megabyteToByte(24)}`,
    });
  }

  onApplicationBootstrap() {
    this.eventEmitter.on(
      SubscriptionPayedAtLeastOneTimeUpdated.eventName,
      (event: SubscriptionPayedAtLeastOneTimeUpdated) =>
        this.handleSubscriptionPayedAtLeastOneTimeUpdated(event).catch((e) =>
          this.sentryTextService.error(e, {
            context: SubscriptionPayedAtLeastOneTimeUpdated.eventName,
            contextService: LandingSubscriptionPaymentListenerService.name,
          }),
        ),
    );
  }
}
