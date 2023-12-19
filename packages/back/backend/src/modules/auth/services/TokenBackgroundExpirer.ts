import { Inject, Injectable, Logger, OnApplicationBootstrap, OnApplicationShutdown } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { config } from "@app/core-config";
import { isDateBefore, setAsyncInterval } from "@worksolutions/utils";
import { DateTime } from "luxon";
import { INTLService, INTLServiceLang, SentryTextService } from "@app/back-kit";
import chalk from "chalk";

import { UserTokenEntity } from "entities/User/Token";

@Injectable()
export class TokenBackgroundExpirerService implements OnApplicationBootstrap, OnApplicationShutdown {
  constructor(
    @Inject(INTLServiceLang.RU) private intlService: INTLService,
    @InjectRepository(UserTokenEntity) private userTokensRepository: Repository<UserTokenEntity>,
    private sentryTextService: SentryTextService,
  ) {}

  private checkTokenDateIsValid(refreshTokenExpiresAt: Date) {
    const dateTime = DateTime.fromJSDate(refreshTokenExpiresAt);
    return isDateBefore({ value: this.intlService.getCurrentDateTime(), comparisonWith: dateTime });
  }

  private async checkUserToken(token: UserTokenEntity) {
    if (this.checkTokenDateIsValid(token.refreshTokenExpiresAt)) return;
    await this.userTokensRepository.delete(token.id);
  }

  private async checkUserTokens() {
    const tokens = await this.userTokensRepository.find();

    for (const token of tokens) {
      try {
        await this.checkUserToken(token);
      } catch (e) {
        this.sentryTextService.error(e, {
          context: `Check admin token expirations; tokenId=${chalk.cyan(token.id)}`,
          contextService: TokenBackgroundExpirerService.name,
        });
      }
    }
  }

  private disposeTimer: Function | undefined;
  private async run() {
    await this.checkUserTokens();
    Logger.log(
      `Run checking with interval [${chalk.cyan(`${config.auth.tokenBackgroundExpiresCheckMs}ms`)}]`,
      TokenBackgroundExpirerService.name,
    );
    this.disposeTimer = setAsyncInterval(() => this.checkUserTokens(), config.auth.tokenBackgroundExpiresCheckMs);
  }

  onApplicationBootstrap() {
    void this.run();
  }

  onApplicationShutdown() {
    this.disposeTimer?.();
  }
}
