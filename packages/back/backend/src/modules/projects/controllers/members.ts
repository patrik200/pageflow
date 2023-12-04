import { ControllerResponse } from "@app/back-kit";
import { UserRole } from "@app/shared-enums";
import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";

import { withUserAuthorized } from "modules/auth";
import {
  RequestCreatePermissionDTO,
  RequestDeletePermissionDTO,
  RequestEditPermissionDTO,
  ResponsePermissionsListDTO,
} from "modules/permissions";

import { GetProjectPermissionsService } from "../services/permissions/get";
import { CreateProjectPermissionsService } from "../services/permissions/create";
import { DeleteProjectPermissionsService } from "../services/permissions/delete";
import { EditProjectPermissionsService } from "../services/permissions/edit";

@Controller("projects/:projectId/members")
export class ProjectsMembersController {
  constructor(
    private getProjectPermissionsService: GetProjectPermissionsService,
    private createProjectPermissionsService: CreateProjectPermissionsService,
    private deleteProjectPermissionsService: DeleteProjectPermissionsService,
    private editProjectPermissionsService: EditProjectPermissionsService,
  ) {}

  @Get()
  @withUserAuthorized([UserRole.USER])
  async getPermissions(@Param("projectId") projectId: string) {
    const permissions = await this.getProjectPermissionsService.getProjectPermissions(projectId, {
      loadUser: true,
      loadUserAvatar: true,
    });
    return new ControllerResponse(ResponsePermissionsListDTO, { list: permissions });
  }

  @Post()
  @withUserAuthorized([UserRole.USER])
  async createMember(@Param("projectId") projectId: string, @Body() body: RequestCreatePermissionDTO) {
    await this.createProjectPermissionsService.createProjectPermission(projectId, body);
  }

  @Delete()
  @withUserAuthorized([UserRole.USER])
  async deleteMember(@Param("projectId") projectId: string, @Body() body: RequestDeletePermissionDTO) {
    await this.deleteProjectPermissionsService.deleteProjectPermission(projectId, body);
  }

  @Patch()
  @withUserAuthorized([UserRole.USER])
  async editMember(@Param("projectId") projectId: string, @Body() body: RequestEditPermissionDTO) {
    await this.editProjectPermissionsService.editTicketBoardPermission(projectId, body);
  }
}
