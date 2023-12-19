import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { CryptoService } from "@app/back-kit";
import { config } from "@app/core-config";
import { isDateAfter } from "@worksolutions/utils";
import { UserRole } from "@app/shared-enums";
import { DateTime } from "luxon";

import { EmailRendererService, EmailSenderService } from "modules/email";
import { currentUserStorage, emptyCurrentUserStorageValue } from "modules/auth";
import { GetClientService } from "modules/clients";

import { GetUserService } from "../user/get";
import { EditUserService } from "../user/edit";

interface TokenOptions {
  userId: string;
  expiresInMS: number;
  clientId: string;
}

@Injectable()
export class ResetPasswordService {
  constructor(
    private cryptoService: CryptoService,
    private getUserService: GetUserService,
    @Inject(forwardRef(() => EmailSenderService)) private emailSenderService: EmailSenderService,
    @Inject(forwardRef(() => EmailRendererService)) private emailRendererService: EmailRendererService,
    @Inject(forwardRef(() => GetClientService)) private getClientService: GetClientService,
    private editUserService: EditUserService,
  ) {}

  async resetPasswordInitial(email: string, clientId: string) {
    const user = await currentUserStorage.run({ ...emptyCurrentUserStorageValue, clientId }, () =>
      this.getUserService.getUser(email, "email"),
    );
    if (!user) return false;

    const tokenOptions: TokenOptions = {
      userId: user.id,
      expiresInMS: DateTime.now()
        .plus({ millisecond: config.restorePassword.restorePasswordTokenExpiresInMS })
        .toMillis(),
      clientId,
    };

    const token = this.cryptoService.encrypt(
      config._secrets.restorePassword.sign,
      JSON.stringify(tokenOptions),
      config._secrets.restorePassword.cryptoIv,
    );

    const client = await this.getClientService.dangerGetClientByIdOrFail(clientId);

    const html = await this.emailRendererService.renderEmailComponent("ResetPasswordCreated", client.domain, {
      token: token.toString("base64url"),
    });

    void this.emailSenderService.send({
      subject: "Восстановление пароля",
      targetEmail: user.email,
      html,
    });

    return true;
  }

  async resetPasswordFinish(token: string, password: string) {
    const decryptedToken = this.cryptoService
      .decrypt(config._secrets.restorePassword.sign, token, config._secrets.restorePassword.cryptoIv)
      .toString("utf8");

    let tokenOptions: TokenOptions | undefined = undefined;
    try {
      tokenOptions = JSON.parse(decryptedToken) as TokenOptions;
    } catch (e) {
      return false;
    }

    const expiresIn = DateTime.fromMillis(tokenOptions.expiresInMS);
    const now = DateTime.now();

    if (isDateAfter({ value: now, comparisonWith: expiresIn })) return false;

    await currentUserStorage.run(
      {
        ...emptyCurrentUserStorageValue,
        clientId: tokenOptions.clientId,
        userId: tokenOptions.userId,
        role: UserRole.ADMIN,
      },
      () => this.editUserService.updateUserOrFail(tokenOptions!.userId, { password }),
    );

    return true;
  }
}
