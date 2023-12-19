import { config } from "@app/core-config";
import { INestApplication, Logger } from "@nestjs/common";
import * as Sentry from "@sentry/node";
import { ProfilingIntegration } from "@sentry/profiling-node";

import { SentryModule } from "modules/sentry";
import { NestService } from "modules/nest";

const enabled = config.sentry.enabled && !!config._secrets.sentry.dsn;

export function initializeSentryModules() {
  Logger.log("Sentry", "Bootstrap");
  return [SentryModule];
}

export async function initializeSentry(app: INestApplication) {
  if (!enabled) return;

  const nestService = await app.resolve(NestService);
  const expressApp = await nestService.getApplication();

  Sentry.init({
    dsn: config._secrets.sentry.dsn!,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.Express({ app: expressApp }),
      new ProfilingIntegration(),
    ],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
  });

  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
}
