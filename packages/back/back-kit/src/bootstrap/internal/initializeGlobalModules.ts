import { CryptoModule } from "modules/crypto/module";
import { INTLModule } from "modules/intl/module";
import { NestModule } from "modules/nest/module";

export function initializeGlobalModules() {
  return [CryptoModule, INTLModule, NestModule];
}
