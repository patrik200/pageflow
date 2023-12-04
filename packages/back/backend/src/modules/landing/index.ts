import { Global, Module } from "@nestjs/common";

import { LandingController } from "./controllers";

import { CreateAdminLandingService } from "./services/admin/create";
import { CreateClientLandingService } from "./services/client/create";
import { ValidateDomainLandingService } from "./services/domain/validate";
import { SendEmailLandingService } from "./services/email/send";
import { GetTariffsLandingService } from "./services/tariffs/create";

@Global()
@Module({
  controllers: [LandingController],
  providers: [
    CreateAdminLandingService,
    CreateClientLandingService,
    ValidateDomainLandingService,
    SendEmailLandingService,
    GetTariffsLandingService,
  ],
})
export class LandingModule {}
