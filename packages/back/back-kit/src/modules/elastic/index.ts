import { Global, Module } from "@nestjs/common";

import { ElasticService } from "./service";

@Global()
@Module({
  providers: [
    {
      provide: ElasticService,
      useFactory: ElasticService.register,
    },
  ],
  exports: [ElasticService],
})
export class ElasticModule {}

export * from "./service";
