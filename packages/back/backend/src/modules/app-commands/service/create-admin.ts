import { forwardRef, Inject, Injectable, LoggerService } from "@nestjs/common";
import { CryptoService } from "@app/back-kit";
import { UserRole } from "@app/shared-enums";
import { config } from "@app/core-config";

import { CreateUserService } from "modules/users";
import { currentUserStorage } from "modules/auth";
import { emptyCurrentUserStorageValue } from "modules/auth/asyncLocalStorage";

@Injectable()
export class CreateAdminCommand {
  constructor(
    @Inject(forwardRef(() => CreateUserService)) private createUserService: CreateUserService,
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
          role: UserRole.ADMIN,
          name: "ADMIN",
          email,
          password,
          position: "ADMIN",
          phone: "",
        }),
      );

      logger.log(
        `Admin "${email}" in client "${clientId}" created. Password = "${password}"`,
        "Create admin user command",
      );
    } catch (e) {
      logger.error(e);
      return;
    }
  }
}
