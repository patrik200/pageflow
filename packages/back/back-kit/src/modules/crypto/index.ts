import { Global, Module } from "@nestjs/common";

import { CryptoService } from "./service";

@Global()
@Module({
  providers: [CryptoService],
  exports: [CryptoService],
})
export class CryptoModule {}

export * from "./service";
