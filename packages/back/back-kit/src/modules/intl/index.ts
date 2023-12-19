import { Global, Module } from "@nestjs/common";

import { europeDateFormats } from "./intlConfig";
import { INTLService, INTLServiceLang } from "./service";

@Global()
@Module({
  providers: [
    {
      provide: INTLServiceLang.RU,
      useFactory: () => new INTLService({ languageCode: "ru", matchDateModeAndLuxonTypeLiteral: europeDateFormats }),
    },
  ],
  exports: [INTLServiceLang.RU],
})
export class INTLModule {}

export * from "./service";
