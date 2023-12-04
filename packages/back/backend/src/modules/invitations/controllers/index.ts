import { Body, Controller, Post } from "@nestjs/common";
import { ControllerResponse } from "@app/back-kit";
import { UserRole } from "@app/shared-enums";

import { ResponseIdDTO } from "constants/ResponseId";

import { withUserAuthorized } from "modules/auth";

import { CreateInvitationService } from "../services/invitation/create";
import { VerifyInvitationService } from "../services/invitation/verify";
import { SubmitInvitationService } from "../services/invitation/submit";
import { SendInvitationService } from "../services/invitation/send";

import { RequestCreateInvitationDTO } from "../dto/createInvitation";
import { RequestCreateUserByInvitationDTO } from "../dto/createUserByInvitation";
import { ResponseInvitationDTO } from "../dto/ResponseInvitationDTO";
import { RequestVerifyInvitationTokenDTO } from "../dto/verifyInvitationToken";

@Controller("invitations")
export class InvitationController {
  constructor(
    private createInvitationService: CreateInvitationService,
    private sendInvitationService: SendInvitationService,
    private verifyInvitationService: VerifyInvitationService,
    private submitInvitationService: SubmitInvitationService,
  ) {}

  @Post("create")
  @withUserAuthorized([UserRole.USER])
  async createInvitation(@Body() createInvitationDTO: RequestCreateInvitationDTO) {
    const token = await this.createInvitationService.createInvitationToken(createInvitationDTO);
    const success = await this.sendInvitationService.sendEmail(createInvitationDTO.email, token);
    return new ControllerResponse(ResponseIdDTO, { id: token, success });
  }

  @Post("verify")
  async verifyInvitationToken(@Body() body: RequestVerifyInvitationTokenDTO) {
    const invitation = await this.verifyInvitationService.verifyTokenOrFail(body.token);
    return new ControllerResponse(ResponseInvitationDTO, invitation);
  }

  @Post("submit")
  async submitInvitation(@Body() body: RequestCreateUserByInvitationDTO) {
    const invitation = await this.verifyInvitationService.verifyTokenOrFail(body.invitation);
    const user = await this.submitInvitationService.registerUserByInvitation(invitation, body);
    return new ControllerResponse(ResponseIdDTO, { id: user.id });
  }
}
