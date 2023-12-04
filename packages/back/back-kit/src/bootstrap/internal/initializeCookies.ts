import { INestApplication, Logger } from "@nestjs/common";
import cookieParser from "cookie-parser";
import { config } from "@app/core-config";

export function initializeCookies(app: INestApplication) {
  app.use(cookieParser(config._secrets.cookies.key));
  Logger.log("Cookies initialized", "Bootstrap");
}
