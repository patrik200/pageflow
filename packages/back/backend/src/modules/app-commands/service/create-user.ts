import { Injectable, Inject, forwardRef, LoggerService } from "@nestjs/common";
import { CryptoService } from "@app/back-kit";
import { UserRole } from "@app/shared-enums";
import { config } from "@app/core-config";

import { CreateUserService as BaseCreateUserService } from "modules/users";
import { currentUserStorage, emptyCurrentUserStorageValue } from "modules/auth";

@Injectable()
export class CreateUserCommand {
  constructor(
    @Inject(forwardRef(() => BaseCreateUserService)) private createUserService: BaseCreateUserService,
    @Inject(forwardRef(() => CryptoService)) private cryptoService: CryptoService,
  ) {}

  private createPassword() {
    if (config.productionEnv) return this.cryptoService.generateRandom(12);
    return "0";
  }

  async run(clientId: string, email: string, logger: LoggerService = console) {
    const password = this.createPassword();

    try {
      await currentUserStorage.run({ ...emptyCurrentUserStorageValue, clientId }, () =>
        this.createUserService.createUserOrFail({
          role: UserRole.USER,
          name: "USER",
          email,
          password,
          position: "USER",
          phone: "",
        }),
      );

      logger.log(`User "${email}" in client "${clientId}" created. Password = "${password}"`, "Create user command");
    } catch (e) {
      logger.error(e);
      return;
    }
  }
}
