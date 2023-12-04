import { Inject, Injectable, Logger, OnApplicationBootstrap, OnApplicationShutdown } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { config } from "@app/core-config";
import { isDateBefore, setAsyncInterval } from "@worksolutions/utils";
import { DateTime } from "luxon";
import { errorLogBeautifier, INTLService, INTLServiceLang } from "@app/back-kit";
import chalk from "chalk";

import { UserTokenEntity } from "entities/User/Token";

@Injectable()
export class TokenBackgroundExpirerService implements OnApplicationBootstrap, OnApplicationShutdown {
  constructor(
    @Inject(INTLServiceLang.RU) private intlService: INTLService,
    @InjectRepository(UserTokenEntity) private userTokensRepository: Repository<UserTokenEntity>,
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
        Logger.error(`Error while check admin token expirations:`, "Background token checker");
        errorLogBeautifier(e);
        Logger.error(`tokenId=${chalk.cyan("123")}`, "Background token checker");
        Logger.log(
          `Run checking with interval [${chalk.cyan(`${config.auth.tokenBackgroundExpiresCheckMs}ms`)}]`,
          "Background token checker",
        );
      }
    }
  }

  private disposeTimer: Function | undefined;

  private async run() {
    await this.checkUserTokens();
    Logger.log(
      `Run checking with interval [${chalk.cyan(`${config.auth.tokenBackgroundExpiresCheckMs}ms`)}]`,
      "Background token checker",
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
