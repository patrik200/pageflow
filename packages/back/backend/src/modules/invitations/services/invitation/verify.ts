import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ServiceError } from "@app/back-kit";

import { InvitationTokenPayload } from "./create";

interface ParsedInvitationTokenPayload extends InvitationTokenPayload {
  exp: number;
}

@Injectable()
export class VerifyInvitationService {
  constructor(private jwtService: JwtService) {}

  async verifyTokenOrFail(token: string): Promise<ParsedInvitationTokenPayload> {
    const invitation = (await this.jwtService.verifyAsync(token)) as ParsedInvitationTokenPayload;
    if (!invitation) throw new ServiceError("invitation", "Приглашение истекло, либо недействительно");
    return invitation;
  }
}
