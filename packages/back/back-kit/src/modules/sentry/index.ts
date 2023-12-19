import { Global, Module } from "@nestjs/common";

import { SentryRequestService, SentryTextService } from "./service";

@Global()
@Module({
  providers: [SentryTextService, SentryRequestService],
  exports: [SentryTextService, SentryRequestService],
})
export class SentryModule {}

export * from "./service";
