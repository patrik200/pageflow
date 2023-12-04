import { Body, Controller, Delete, Param, Patch, Post } from "@nestjs/common";
import { UserRole } from "@app/shared-enums";

import { withUserAuthorized } from "modules/auth";
import { RequestCreatePermissionDTO, RequestDeletePermissionDTO, RequestEditPermissionDTO } from "modules/permissions";

import { CreateCorrespondenceGroupPermissionsService } from "../create";
import { DeleteCorrespondenceGroupPermissionsService } from "../delete";
import { EditCorrespondenceGroupPermissionsService } from "../edit";

@Controller("correspondences/correspondence-group/:groupId/permissions")
export class CorrespondenceGroupPermissionsController {
  constructor(
    private createCorrespondenceGroupPermissionsService: CreateCorrespondenceGroupPermissionsService,
    private deleteCorrespondenceGroupPermissionsService: DeleteCorrespondenceGroupPermissionsService,
    private editCorrespondenceGroupPermissionsService: EditCorrespondenceGroupPermissionsService,
  ) {}

  @Post()
  @withUserAuthorized([UserRole.USER])
  async createCorrespondenceGroupPermission(
    @Param("groupId") groupId: string,
    @Body() body: RequestCreatePermissionDTO,
  ) {
    await this.createCorrespondenceGroupPermissionsService.createCorrespondenceGroupPermission(groupId, {
      role: body.role,
      userId: body.userId,
      canEditEditorPermissions: body.canEditEditorPermissions,
      canEditReaderPermissions: body.canEditReaderPermissions,
    });
  }

  @Delete()
  @withUserAuthorized([UserRole.USER])
  async deleteCorrespondenceGroupPermission(
    @Param("groupId") groupId: string,
    @Body() body: RequestDeletePermissionDTO,
  ) {
    await this.deleteCorrespondenceGroupPermissionsService.deleteCorrespondenceGroupPermission(groupId, {
      userId: body.userId,
    });
  }

  @Patch()
  @withUserAuthorized([UserRole.USER])
  async editCorrespondenceGroupPermission(@Param("groupId") groupId: string, @Body() body: RequestEditPermissionDTO) {
    await this.editCorrespondenceGroupPermissionsService.editCorrespondenceGroupPermission(groupId, {
      userId: body.userId,
      role: body.role,
      canEditEditorPermissions: body.canEditEditorPermissions,
      canEditReaderPermissions: body.canEditReaderPermissions,
    });
  }
}
