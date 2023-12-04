import { Global, Module } from "@nestjs/common";

import { ElasticController } from "./controllers";

import { ElasticRecreateIndexesService } from "./services/recreate-indexes";

@Global()
@Module({
  controllers: [ElasticController],
  providers: [ElasticRecreateIndexesService],
  exports: [ElasticRecreateIndexesService],
})
export class ElasticModule {}

export * from "./services/recreate-indexes";
