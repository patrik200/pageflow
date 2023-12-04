import { forwardRef, Inject, Injectable } from "@nestjs/common";

import { EmailRendererService, EmailSenderService } from "modules/email";

@Injectable()
export class SendEmailLandingService {
  constructor(
    @Inject(forwardRef(() => EmailSenderService)) private emailSenderService: EmailSenderService,
    @Inject(forwardRef(() => EmailRendererService)) private emailRendererService: EmailRendererService,
  ) {}

  async sendEmail(domain: string, email: string, password: string) {
    const html = await this.emailRendererService.renderEmailComponent("ClientCreated", domain, {
      adminEmail: email,
      adminPassword: password,
    });

    await this.emailSenderService.send({ targetEmail: email, html, subject: "Стенд развернут" });
  }
}
