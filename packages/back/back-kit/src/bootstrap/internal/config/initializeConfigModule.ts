import { Global, Module, Type } from "@nestjs/common";

import { PROJECT_ROOT_PATH_VAR } from "./variables";

export interface InitializeConfigModuleOptions {
  projectRootPath: string;
}

export function initializeConfigModule({ projectRootPath }: InitializeConfigModuleOptions) {
  @Global()
  @Module({
    providers: [{ provide: PROJECT_ROOT_PATH_VAR, useValue: projectRootPath }],
    exports: [PROJECT_ROOT_PATH_VAR],
  })
  class ConfigModule {}
  return ConfigModule as Type;
}

export * from "./variables";
