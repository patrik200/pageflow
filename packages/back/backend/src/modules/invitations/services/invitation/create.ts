import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { DateTime } from "luxon";
import { config } from "@app/core-config";
import { UserRole } from "@app/shared-enums";

import { getCurrentUser } from "modules/auth";

import { RequestCreateInvitationDTO } from "../../dto/createInvitation";

export interface InvitationTokenPayload {
  name: string;
  position?: string;
  email: string;
  role: UserRole;
  phone?: string;
  clientId: string;
}

@Injectable()
export class CreateInvitationService {
  constructor(private jwtService: JwtService) {}

  async createInvitationToken(dto: RequestCreateInvitationDTO) {
    const currentUser = getCurrentUser();

    const payload: InvitationTokenPayload = {
      name: dto.name,
      email: dto.email,
      role: dto.role,
      phone: dto.phone,
      position: dto.position,
      clientId: currentUser.clientId,
    };

    const expiresIn = DateTime.fromMillis(config.invitations.tokenExpiresInMS).toMillis().toFixed();

    return this.jwtService.signAsync(payload, { expiresIn });
  }
}
