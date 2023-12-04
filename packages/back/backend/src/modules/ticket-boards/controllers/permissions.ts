import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { UserRole } from "@app/shared-enums";
import { ControllerResponse } from "@app/back-kit";

import { withUserAuthorized } from "modules/auth";
import {
  RequestCreatePermissionDTO,
  ResponsePermissionsListDTO,
  RequestDeletePermissionDTO,
  RequestEditPermissionDTO,
} from "modules/permissions";

import { GetTicketBoardPermissionsService } from "../services/permissions/get";
import { CreateTicketBoardPermissionsService } from "../services/permissions/create";
import { DeleteTicketBoardPermissionsService } from "../services/permissions/delete";
import { EditTicketBoardPermissionsService } from "../services/permissions/edit";

@Controller("ticket-boards")
export class TicketBoardPermissionsController {
  constructor(
    private getTicketBoardPermissionsService: GetTicketBoardPermissionsService,
    private createTicketBoardPermissionsService: CreateTicketBoardPermissionsService,
    private deleteTicketBoardPermissionsService: DeleteTicketBoardPermissionsService,
    private editTicketBoardPermissionsService: EditTicketBoardPermissionsService,
  ) {}

  @Get(":boardId/permissions")
  @withUserAuthorized([UserRole.USER])
  async permissions(@Param("boardId") boardId: string) {
    const permissions = await this.getTicketBoardPermissionsService.getTicketBoardPermissions(boardId, {
      loadUser: true,
      loadUserAvatar: true,
    });

    return new ControllerResponse(ResponsePermissionsListDTO, { list: permissions });
  }

  @Post(":boardId/permissions")
  @withUserAuthorized([UserRole.USER])
  async createPermission(@Param("boardId") boardId: string, @Body() body: RequestCreatePermissionDTO) {
    await this.createTicketBoardPermissionsService.createTicketBoardPermission(boardId, {
      role: body.role,
      userId: body.userId,
      canEditEditorPermissions: body.canEditEditorPermissions,
      canEditReaderPermissions: body.canEditReaderPermissions,
    });
  }

  @Delete(":boardId/permissions")
  @withUserAuthorized([UserRole.USER])
  async deletePermission(@Param("boardId") boardId: string, @Body() body: RequestDeletePermissionDTO) {
    await this.deleteTicketBoardPermissionsService.deleteTicketBoardPermission(boardId, {
      userId: body.userId,
    });
  }

  @Patch(":boardId/permissions")
  @withUserAuthorized([UserRole.USER])
  async editPermission(@Param("boardId") boardId: string, @Body() body: RequestEditPermissionDTO) {
    await this.editTicketBoardPermissionsService.editTicketBoardPermission(boardId, {
      userId: body.userId,
      role: body.role,
      canEditEditorPermissions: body.canEditEditorPermissions,
      canEditReaderPermissions: body.canEditReaderPermissions,
    });
  }
}
