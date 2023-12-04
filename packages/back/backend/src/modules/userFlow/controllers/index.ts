import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { UserRole } from "@app/shared-enums";
import { ControllerResponse } from "@app/back-kit";

import { ResponseIdDTO } from "constants/ResponseId";

import { withUserAuthorized } from "modules/auth";

import { GetUserFlowService } from "../services/get";
import { EditUserFlowService } from "../services/edit";

import { ResponseUserFlowDTO, ResponseUserFlowListDTO } from "../dto/get/UserFlow";
import { RequestCreateUserFlowDTO } from "../dto/edit/CreateUserFlow";
import { RequestUpdateUserFlowDTO } from "../dto/edit/UpdateUserFlow";

@Controller("user-flow")
export class UserFlowController {
  constructor(private getUserFlowService: GetUserFlowService, private editUserFlowService: EditUserFlowService) {}

  @Get()
  @withUserAuthorized([UserRole.USER])
  async getUserFlows() {
    const userFlows = await this.getUserFlowService.getUserFlowListOrFail({
      loadReviewer: true,
      loadReviewerUser: true,
      loadReviewerUserAvatar: true,
      loadRows: true,
      loadRowsUsers: true,
      loadRowsUsersUser: true,
      loadRowsUsersUserAvatar: true,
    });

    return new ControllerResponse(ResponseUserFlowListDTO, { list: userFlows });
  }

  @Get(":userFlowId")
  @withUserAuthorized([UserRole.USER])
  async getUserFlowDetail(@Param("userFlowId") id: string) {
    const userFlow = await this.getUserFlowService.getUserFlowOrFail(id, {
      loadReviewer: true,
      loadReviewerUser: true,
      loadReviewerUserAvatar: true,
      loadRows: true,
      loadRowsUsers: true,
      loadRowsUsersUser: true,
      loadRowsUsersUserAvatar: true,
    });

    return new ControllerResponse(ResponseUserFlowDTO, userFlow);
  }

  @Post()
  @withUserAuthorized([UserRole.USER])
  async createUserFlow(@Body() body: RequestCreateUserFlowDTO) {
    const userFlowId = await this.editUserFlowService.createOrFail(body);
    return new ControllerResponse(ResponseIdDTO, { id: userFlowId });
  }

  @Patch(":userFlowId")
  @withUserAuthorized([UserRole.USER])
  async updateUserFlow(@Param("userFlowId") id: string, @Body() body: RequestUpdateUserFlowDTO) {
    await this.editUserFlowService.updateOrFail(id, body);
  }

  @Delete(":userFlowId")
  @withUserAuthorized([UserRole.USER])
  async deleteUserFlow(@Param("userFlowId") id: string) {
    await this.editUserFlowService.deleteOrFail(id);
  }
}
