import { Global, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { config } from "@app/core-config";

import { InvitationController } from "./controllers";

import { CreateInvitationService } from "./services/invitation/create";
import { SendInvitationService } from "./services/invitation/send";
import { SubmitInvitationService } from "./services/invitation/submit";
import { VerifyInvitationService } from "./services/invitation/verify";

@Global()
@Module({
  imports: [JwtModule.register({ secret: config._secrets.auth.sign })],
  controllers: [InvitationController],
  providers: [CreateInvitationService, VerifyInvitationService, SubmitInvitationService, SendInvitationService],
  exports: [CreateInvitationService, VerifyInvitationService, SubmitInvitationService, SendInvitationService],
})
export class InvitationsModule {}

export * from "./services/invitation/create";
export * from "./services/invitation/send";
export * from "./services/invitation/submit";
export * from "./services/invitation/verify";
