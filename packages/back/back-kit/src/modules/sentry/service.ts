import { Injectable } from "@nestjs/common";

import { BaseExpressRequest } from "types";

import { BaseSentryService, BaseSentryServiceAdditionalData } from "./base-service";

@Injectable()
export class SentryTextService extends BaseSentryService {
  log(message: string | Error, options?: BaseSentryServiceAdditionalData) {
    if (message instanceof Error) {
      this.__logError(message, options);
      return;
    }

    this.__log(message, options);
  }

  info(message: string, options?: BaseSentryServiceAdditionalData) {
    this.__info(message, options);
  }

  error(error: unknown, options?: BaseSentryServiceAdditionalData) {
    if (error instanceof Error) {
      this.__error(error, options);
      return;
    }
  }
}

@Injectable()
export class SentryRequestService extends BaseSentryService {
  error(req: BaseExpressRequest<{ userId: string } | undefined>, error: Error) {
    this.__error(
      {
        message: `\
[${req.method} | ${req.originalUrl}]
${error.message}\
`,
        stack: error.stack,
      },
      { userId: req.user?.userId },
    );
  }
}
