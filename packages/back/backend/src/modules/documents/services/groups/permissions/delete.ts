import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { PermissionEntityType } from "@app/shared-enums";

import { DeletePermissionService } from "modules/permissions";

import { GetDocumentGroupService } from "../get";

@Injectable()
export class DeleteDocumentGroupPermissionsService {
  constructor(
    private getDocumentGroupService: GetDocumentGroupService,
    @Inject(forwardRef(() => DeletePermissionService)) private deletePermissionService: DeletePermissionService,
  ) {}

  async deleteDocumentGroupPermission(groupId: string, data: { userId: string }) {
    await this.getDocumentGroupService.getGroupOrFail(groupId);

    await this.deletePermissionService.deletePermissionOrFail({
      entityId: groupId,
      entityType: PermissionEntityType.DOCUMENT_GROUP,
      userId: data.userId,
    });
  }
}
