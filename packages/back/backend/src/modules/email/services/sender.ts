import { Injectable, Logger } from "@nestjs/common";
import { config } from "@app/core-config";
import nodemailer from "nodemailer";
import { promiseQueue } from "@worksolutions/utils";
import { errorLogBeautifier } from "@app/back-kit";

const transporter = nodemailer.createTransport({
  host: config._secrets.email.host,
  port: config._secrets.email.port,
  secure: true,
  auth: {
    user: config._secrets.email.user,
    pass: config._secrets.email.password,
  },
});

const queue = promiseQueue(config.email.queueMaxElements);

export interface EmailInterface {
  targetEmail: string;
  subject?: string;
  html?: string;
}

@Injectable()
export class EmailSenderService {
  constructor() {
    if (config.email.verify) this.verify();
  }

  private async verify() {
    try {
      await transporter.verify();
      this.verified = true;
      Logger.log("Email verify success", "EmailService");
    } catch (error) {
      Logger.error("Email verify error", "EmailService");
      errorLogBeautifier(error);
    }
  }

  private verified = !config.email.verify;

  private async sendEmail(options: EmailInterface) {
    if (!this.verified) {
      Logger.error("Email send error because not verified", "EmailService");
      return false;
    }

    try {
      await transporter.sendMail({
        from: `NoReply <${config._secrets.email.user}>`,
        to: options.targetEmail,
        subject: options.subject,
        html: options.html,
      });
      return true;
    } catch (error) {
      Logger.error("Email send error", "EmailService");
      errorLogBeautifier(error);
      return false;
    }
  }

  async send(options: EmailInterface) {
    return await queue(() => this.sendEmail(options));
  }
}
