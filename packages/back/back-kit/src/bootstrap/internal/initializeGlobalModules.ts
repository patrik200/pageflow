import { CryptoModule } from "modules/crypto";
import { INTLModule } from "modules/intl";
import { NestModule } from "modules/nest";

export function initializeGlobalModules() {
  return [CryptoModule, INTLModule, NestModule];
}
