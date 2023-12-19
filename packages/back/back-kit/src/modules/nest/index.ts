import { Global, Module } from "@nestjs/common";

import { NestService } from "./service";

@Global()
@Module({
  providers: [NestService],
  exports: [NestService],
})
export class NestModule {}

export * from "./service";
