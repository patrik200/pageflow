import { Body, Controller, Delete, Param, Patch, Post } from "@nestjs/common";
import { UserRole } from "@app/shared-enums";

import { withUserAuthorized } from "modules/auth";
import { RequestCreatePermissionDTO, RequestDeletePermissionDTO, RequestEditPermissionDTO } from "modules/permissions";

import { CreateDocumentPermissionsService } from "../create";
import { DeleteDocumentPermissionsService } from "../delete";
import { EditDocumentPermissionsService } from "../edit";

@Controller("documents/document/:documentId/permissions")
export class DocumentPermissionsController {
  constructor(
    private createDocumentPermissionsService: CreateDocumentPermissionsService,
    private deleteDocumentPermissionsService: DeleteDocumentPermissionsService,
    private editDocumentPermissionsService: EditDocumentPermissionsService,
  ) {}

  @Post()
  @withUserAuthorized([UserRole.USER])
  async createDocumentPermission(@Param("documentId") documentId: string, @Body() body: RequestCreatePermissionDTO) {
    await this.createDocumentPermissionsService.createDocumentPermission(documentId, {
      role: body.role,
      userId: body.userId,
      canEditEditorPermissions: body.canEditEditorPermissions,
      canEditReaderPermissions: body.canEditReaderPermissions,
    });
  }

  @Delete()
  @withUserAuthorized([UserRole.USER])
  async deleteDocumentPermission(@Param("documentId") documentId: string, @Body() body: RequestDeletePermissionDTO) {
    await this.deleteDocumentPermissionsService.deleteDocumentPermission(documentId, {
      userId: body.userId,
    });
  }

  @Patch()
  @withUserAuthorized([UserRole.USER])
  async editDocumentPermission(@Param("documentId") documentId: string, @Body() body: RequestEditPermissionDTO) {
    await this.editDocumentPermissionsService.editDocumentPermission(documentId, {
      userId: body.userId,
      role: body.role,
      canEditEditorPermissions: body.canEditEditorPermissions,
      canEditReaderPermissions: body.canEditReaderPermissions,
    });
  }
}
