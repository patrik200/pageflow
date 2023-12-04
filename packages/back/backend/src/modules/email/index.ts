import { Global, Module } from "@nestjs/common";

import { EmailSenderService } from "./services/sender";
import { EmailRendererService } from "./services/renderer";

@Global()
@Module({
  providers: [EmailSenderService, EmailRendererService],
  exports: [EmailSenderService, EmailRendererService],
})
export class EmailModule {}

export * from "./services/sender";
export * from "./services/renderer";
