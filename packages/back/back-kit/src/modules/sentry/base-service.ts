import { captureMessage } from "@sentry/node";
import { config } from "@app/core-config";
import { Logger } from "@nestjs/common";

export interface BaseSentryServiceAdditionalData {
  additionalData?: string;
  userId?: string;
  context?: string;
  contextService?: string;
}

export class BaseSentryService {
  private buildMessage(
    message: string,
    { context, contextService, additionalData, userId }: BaseSentryServiceAdditionalData,
  ) {
    return `\
${contextService ? "|" + contextService + (context ? "|  " : "|\n") : ""}
${context ? "---------- " + context + " ----------\n" : ""}\
${message}\
${userId ? "\n\nUser: " + userId + "\n" : ""}\
${additionalData ? "\n--------------\n" + additionalData : ""}\
`;
  }

  protected __log(message: string, options: BaseSentryServiceAdditionalData = {}) {
    const resultMessage = this.buildMessage(message, options);
    Logger.debug(resultMessage, options.contextService);
    console.log("");
  }

  protected __logError(error: { message: string; stack?: string }, options: BaseSentryServiceAdditionalData = {}) {
    const resultMessage = this.buildMessage(error.message, options);
    Logger.error(resultMessage, error.stack, options.contextService);
    console.log("");
  }

  protected __info(message: string, options: BaseSentryServiceAdditionalData = {}) {
    const resultMessage = this.buildMessage(message, options);
    Logger.log(resultMessage, options.contextService);
    console.log("");
    if (config.sentry.enabled) captureMessage(resultMessage, { level: "log", user: { id: options.userId } });
  }

  protected __error(error: { message: string; stack?: string }, options: BaseSentryServiceAdditionalData = {}) {
    const resultMessage = this.buildMessage(error.message, options);
    Logger.error(resultMessage, error.stack, options.contextService);
    console.log("");
    if (config.sentry.enabled)
      captureMessage(resultMessage, { level: "error", extra: { stack: error.stack }, user: { id: options.userId } });
  }
}
