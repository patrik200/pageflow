import { Inject, Injectable, forwardRef } from "@nestjs/common";

import { getCurrentUser } from "modules/auth";
import { GetClientService } from "modules/clients";
import { EmailRendererService, EmailSenderService } from "modules/email";

import { VerifyInvitationService } from "./verify";

@Injectable()
export class SendInvitationService {
  constructor(
    private verifyInvitationService: VerifyInvitationService,
    @Inject(forwardRef(() => EmailRendererService)) private emailRendererService: EmailRendererService,
    @Inject(forwardRef(() => EmailSenderService)) private emailSenderService: EmailSenderService,
    @Inject(forwardRef(() => GetClientService)) private getClientService: GetClientService,
  ) {}

  async sendEmail(targetEmail: string, token: string) {
    const { clientId } = getCurrentUser();
    const client = await this.getClientService.dangerGetClientByIdOrFail(clientId);

    const { exp } = await this.verifyInvitationService.verifyTokenOrFail(token);
    const invitationExpiresAt = new Date(exp * 1000);

    const html = await this.emailRendererService.renderEmailComponent("InvitationCreated", client.domain, {
      token,
      invitationExpiresAt,
    });

    return await this.emailSenderService.send({
      subject: "Приглашение в PageFlow",
      targetEmail,
      html,
    });
  }
}
