import { forwardRef, Inject, Injectable } from "@nestjs/common";

import { CreateUserService } from "modules/users";

import { InvitationTokenPayload } from "./create";
import { RequestCreateUserByInvitationDTO } from "../../dto/createUserByInvitation";

@Injectable()
export class SubmitInvitationService {
  constructor(@Inject(forwardRef(() => CreateUserService)) private createUserService: CreateUserService) {}

  async registerUserByInvitation(invitation: InvitationTokenPayload, body: RequestCreateUserByInvitationDTO) {
    return await this.createUserService.createUserByInvitationOrFail({
      email: invitation.email,
      phone: body.phone,
      position: invitation.position,
      role: invitation.role,
      name: body.name,
      password: body.password,
      clientId: invitation.clientId,
    });
  }
}
