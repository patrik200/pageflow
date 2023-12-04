import { INestApplication, Logger } from "@nestjs/common";
import { config } from "@app/core-config";

import { localhostCorsConfig } from "bootstrap/localhostCorsConfig";

export function initializeCors(app: INestApplication) {
  if (config.productionEnv) return;
  app.enableCors(localhostCorsConfig);
  Logger.log("CORS initialized", "Bootstrap");
}
