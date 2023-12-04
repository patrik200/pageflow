import "reflect-metadata";
import { INestApplication, Logger, Module, Type } from "@nestjs/common";
import chalk from "chalk";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { config } from "@app/core-config";

import { initializeOrm } from "./internal/initializeOrm";
import { initializeGlobalModules } from "./internal/initializeGlobalModules";
import { initializeSerializers } from "./internal/initializeSerializers";
import { initializeCors } from "./internal/initializeCors";
import { initializeNest } from "./internal/initializeNest";
import { initializeCookies } from "./internal/initializeCookies";
import { initializeConfigModule, InitializeConfigModuleOptions } from "./internal/config/initializeConfigModule";
import { initializeStorage } from "./internal/initializeStorage";
import { patchLogger } from "./internal/pathLogger";
import { initializeFiles } from "./internal/initializeFiles";
import { initializeElastic } from "./internal/initializeElastic";
import { initializeImageProcessor } from "./internal/initializeImageProcessor";
import { errorLogBeautifier } from "../libs";

Error.stackTraceLimit = 100;

interface BootstrapOptions extends InitializeConfigModuleOptions {
  logEventEmitter: boolean;
  logOrm: boolean;
  entityPaths: string[];
  synchronizeDB: boolean;
}

export async function bootstrap<MAIN>(
  MainModule: Type<MAIN>,
  { logEventEmitter, logOrm, entityPaths, synchronizeDB, projectRootPath }: BootstrapOptions,
) {
  patchLogger(logEventEmitter);
  @Module({
    imports: [
      MainModule,
      EventEmitterModule.forRoot(),
      ...initializeGlobalModules(),
      initializeConfigModule({ projectRootPath }),
      initializeOrm(logOrm, synchronizeDB, entityPaths),
      initializeStorage(),
      initializeElastic(),
      initializeImageProcessor(),
    ],
  })
  class AppModule {}

  Logger.log(`Production = ${config.productionEnv ? chalk.blue("true") : chalk.red("false")}`, "Bootstrap");

  const { app } = await initializeNest(AppModule);

  await initializeFiles(app, config.rootPath);
  initializeSerializers(app);
  initializeCors(app);
  initializeCookies(app);
  app.setGlobalPrefix("/api");

  return { app, listen: listenFabric(app, config.server), close: closeFabric(app) };
}

function listenFabric(app: INestApplication, port: number) {
  async function run() {
    try {
      await app.listen(port, () => Logger.log(`App server listening http://localhost:${port}`, "Bootstrap"));
      return true;
    } catch (e) {
      Logger.error("Can not run server. Turning off", "Bootstrap");
      errorLogBeautifier(e);
      setTimeout(() => process.exit(1), 3000);
      return false;
    }
  }

  return run;
}

function closeFabric(app: INestApplication) {
  async function run() {
    try {
      await app.close();
      Logger.log(`App server closed`, "Bootstrap");
    } catch (e) {
      Logger.error("Can not close server. Turning off", "Bootstrap");
      errorLogBeautifier(e);
      setTimeout(() => process.exit(1), 3000);
      return false;
    }
  }

  return run;
}

export { localhostCorsConfig } from "./localhostCorsConfig";
