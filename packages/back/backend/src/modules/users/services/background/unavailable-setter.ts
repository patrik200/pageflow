import { Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LessThanOrEqual, Repository } from "typeorm";
import { errorLogBeautifier } from "@app/back-kit";
import { setAsyncInterval } from "@worksolutions/utils";
import chalk from "chalk";
import { config } from "@app/core-config";

import { UserEntity } from "entities/User";

export class UserUnavailableUntilSetterService {
  constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) {}

  private loggerContext = "User unavailableUntil setter";

  private async removeUnavailableUntil(user: UserEntity) {
    await this.userRepository.update(user.id, { unavailableUntil: null });
  }

  private async checkUsers() {
    const currentDate = new Date();

    const users = await this.userRepository.find({ where: { unavailableUntil: LessThanOrEqual(currentDate) } });

    for (const user of users) {
      try {
        await this.removeUnavailableUntil(user);
      } catch (e) {
        Logger.error("Error while setting user unavailableUntil", this.loggerContext);
        errorLogBeautifier(e);
      }
    }
  }

  private disposeTimer: Function | undefined;
  private async run() {
    await this.checkUsers();
    Logger.log(
      `Run checking with interval [${chalk.cyan(`${config.users.unavailableUntilCheckIntervalMs}ms`)}]`,
      this.loggerContext,
    );
    this.disposeTimer = setAsyncInterval(() => this.checkUsers(), config.users.unavailableUntilCheckIntervalMs);
  }

  onApplicationBootstrap() {
    void this.run();
  }

  onApplicationShutdown() {
    this.disposeTimer?.();
  }
}
