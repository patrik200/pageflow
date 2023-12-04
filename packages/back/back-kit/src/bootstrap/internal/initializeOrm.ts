import { addTransactionalDataSource, initializeTransactionalContext } from "typeorm-transactional";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { DataSourceOptions, DataSource } from "typeorm";
import { config } from "@app/core-config";

initializeTransactionalContext();

export function initializeOrm(logging: boolean, synchronizeDB: boolean, entityPaths: string[]) {
  return TypeOrmModule.forRootAsync({
    useFactory: (): TypeOrmModuleOptions => ({
      ...(config.typeorm as DataSourceOptions),
      entities: entityPaths,
      migrations: [],
      logger: "advanced-console",
      synchronize: synchronizeDB,
      logging,
    }),
    async dataSourceFactory(options) {
      if (!options) throw new Error("Invalid options passed");
      return addTransactionalDataSource(new DataSource(options));
    },
  });
}
