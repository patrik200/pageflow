import { Body, Controller, Delete, Param, Patch, Post } from "@nestjs/common";
import { UserRole } from "@app/shared-enums";

import { withUserAuthorized } from "modules/auth";
import { RequestCreatePermissionDTO, RequestDeletePermissionDTO, RequestEditPermissionDTO } from "modules/permissions";

import { CreateDocumentGroupPermissionsService } from "../create";
import { DeleteDocumentGroupPermissionsService } from "../delete";
import { EditDocumentGroupPermissionsService } from "../edit";

@Controller("documents/document-group/:groupId/permissions")
export class DocumentGroupPermissionsController {
  constructor(
    private createDocumentGroupPermissionsService: CreateDocumentGroupPermissionsService,
    private deleteDocumentGroupPermissionsService: DeleteDocumentGroupPermissionsService,
    private editDocumentGroupPermissionsService: EditDocumentGroupPermissionsService,
  ) {}

  @Post()
  @withUserAuthorized([UserRole.USER])
  async createDocumentGroupPermission(@Param("groupId") groupId: string, @Body() body: RequestCreatePermissionDTO) {
    await this.createDocumentGroupPermissionsService.createDocumentGroupPermission(groupId, {
      role: body.role,
      userId: body.userId,
      canEditEditorPermissions: body.canEditEditorPermissions,
      canEditReaderPermissions: body.canEditReaderPermissions,
    });
  }

  @Delete()
  @withUserAuthorized([UserRole.USER])
  async deleteDocumentGroupPermission(@Param("groupId") groupId: string, @Body() body: RequestDeletePermissionDTO) {
    await this.deleteDocumentGroupPermissionsService.deleteDocumentGroupPermission(groupId, {
      userId: body.userId,
    });
  }

  @Patch()
  @withUserAuthorized([UserRole.USER])
  async editDocumentGroupPermission(@Param("groupId") groupId: string, @Body() body: RequestEditPermissionDTO) {
    await this.editDocumentGroupPermissionsService.editDocumentGroupPermission(groupId, {
      userId: body.userId,
      role: body.role,
      canEditEditorPermissions: body.canEditEditorPermissions,
      canEditReaderPermissions: body.canEditReaderPermissions,
    });
  }
}
