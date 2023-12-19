import { Inject, Injectable, Logger, OnApplicationBootstrap, OnApplicationShutdown } from "@nestjs/common";
import { config } from "@app/core-config";
import { setAsyncInterval } from "@worksolutions/utils";
import { INTLService, INTLServiceLang, SentryTextService } from "@app/back-kit";
import chalk from "chalk";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, LessThan } from "typeorm";

import { SubscriptionEntity } from "entities/Subscription";

import { Tariffs } from "fixtures/tariffs";

import { DeleteClientService } from "../delete";

@Injectable()
export class UnusedClientsBackgroundDeleterService implements OnApplicationBootstrap, OnApplicationShutdown {
  constructor(
    @InjectRepository(SubscriptionEntity) private subscriptionRepository: Repository<SubscriptionEntity>,
    @Inject(INTLServiceLang.RU) private intlService: INTLService,
    private deleteClientService: DeleteClientService,
    private sentryTextService: SentryTextService,
  ) {}

  private async deleteSubscriptionAndClient(subscription: SubscriptionEntity) {
    await this.deleteClientService.dangerDeleteClientOrFail(subscription.client.id);
  }

  private async checkClients() {
    const now = this.intlService.getCurrentDateTime();

    const subscriptions = await Promise.all([
      this.subscriptionRepository.find({
        where: {
          tariff: Tariffs.START,
          payedAtLeastOneTime: true,
          payedUntil: LessThan(now.minus({ month: 3 }).toJSDate()),
        },
        relations: { client: true },
      }),
      this.subscriptionRepository.find({
        where: {
          tariff: Tariffs.START,
          payedAtLeastOneTime: false,
          payedUntil: LessThan(now.minus({ month: 2 }).toJSDate()),
        },
        relations: { client: true },
      }),
    ]).then((subscriptions) => subscriptions.flat());

    for (const subscriptionsToDelete of subscriptions) {
      try {
        await this.deleteSubscriptionAndClient(subscriptionsToDelete);
      } catch (e) {
        this.sentryTextService.error(e, {
          context: `Deleting subscription; subscriptionId=${chalk.cyan(subscriptionsToDelete.id)}`,
          contextService: UnusedClientsBackgroundDeleterService.name,
        });
      }
    }
  }

  private disposeTimer: Function | undefined;
  private async run() {
    await this.checkClients();
    Logger.log(
      `Run checking with interval [${chalk.cyan(`${config.client.checkForDeleteUnusedIntervalMs}ms`)}]`,
      UnusedClientsBackgroundDeleterService.name,
    );
    this.disposeTimer = setAsyncInterval(() => this.checkClients(), config.client.checkForDeleteUnusedIntervalMs);
  }

  onApplicationBootstrap() {
    void this.run();
  }

  onApplicationShutdown() {
    this.disposeTimer?.();
  }
}
