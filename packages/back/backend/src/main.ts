import path from "node:path";
import { bootstrap } from "@app/back-kit";
import { config } from "@app/core-config";

import { projectRootPath } from "constants/projectRootPath";

import { MainModule } from "modules/main";

bootstrap(MainModule, {
  logOrm: false,
  logEventEmitter: false,
  synchronizeDB: true,
  entityPaths: [
    path.join(config.rootPath, "packages", "back", "back-kit", "dist/*.js"),
    path.join(config.rootPath, "packages", "back", "backend", "dist/entities/**/*.js"),
  ],
  projectRootPath,
}).then(({ listen }) => listen());
