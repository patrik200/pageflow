import { Body, Controller, Delete, Param, Patch, Post } from "@nestjs/common";
import { UserRole } from "@app/shared-enums";

import { withUserAuthorized } from "modules/auth";
import { RequestCreatePermissionDTO, RequestDeletePermissionDTO, RequestEditPermissionDTO } from "modules/permissions";

import { CreateCorrespondencePermissionsService } from "../create";
import { DeleteCorrespondencePermissionsService } from "../delete";
import { EditCorrespondencePermissionsService } from "../edit";

@Controller("correspondences/correspondence/:correspondenceId/permissions")
export class CorrespondencePermissionsController {
  constructor(
    private createCorrespondencePermissionsService: CreateCorrespondencePermissionsService,
    private deleteCorrespondencePermissionsService: DeleteCorrespondencePermissionsService,
    private editCorrespondencePermissionsService: EditCorrespondencePermissionsService,
  ) {}

  @Post()
  @withUserAuthorized([UserRole.USER])
  async createCorrespondencePermission(
    @Param("correspondenceId") correspondenceId: string,
    @Body() body: RequestCreatePermissionDTO,
  ) {
    await this.createCorrespondencePermissionsService.createCorrespondencePermission(correspondenceId, {
      role: body.role,
      userId: body.userId,
      canEditEditorPermissions: body.canEditEditorPermissions,
      canEditReaderPermissions: body.canEditReaderPermissions,
    });
  }

  @Delete()
  @withUserAuthorized([UserRole.USER])
  async deleteCorrespondencePermission(
    @Param("correspondenceId") correspondenceId: string,
    @Body() body: RequestDeletePermissionDTO,
  ) {
    await this.deleteCorrespondencePermissionsService.deleteCorrespondencePermission(correspondenceId, {
      userId: body.userId,
    });
  }

  @Patch()
  @withUserAuthorized([UserRole.USER])
  async editCorrespondencePermission(
    @Param("correspondenceId") correspondenceId: string,
    @Body() body: RequestEditPermissionDTO,
  ) {
    await this.editCorrespondencePermissionsService.editCorrespondencePermission(correspondenceId, {
      userId: body.userId,
      role: body.role,
      canEditEditorPermissions: body.canEditEditorPermissions,
      canEditReaderPermissions: body.canEditReaderPermissions,
    });
  }
}
