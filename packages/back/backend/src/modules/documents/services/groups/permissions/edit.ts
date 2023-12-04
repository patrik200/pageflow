import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { PermissionEntityType } from "@app/shared-enums";

import { EditPermissionInterface, EditPermissionService } from "modules/permissions";

import { GetDocumentGroupService } from "../get";

@Injectable()
export class EditDocumentGroupPermissionsService {
  constructor(
    private getDocumentGroupService: GetDocumentGroupService,
    @Inject(forwardRef(() => EditPermissionService)) private editPermissionService: EditPermissionService,
  ) {}

  async editDocumentGroupPermission(groupId: string, data: EditPermissionInterface & { userId: string }) {
    await this.getDocumentGroupService.getGroupOrFail(groupId);

    await this.editPermissionService.editPermissionOrFail(
      { entityId: groupId, entityType: PermissionEntityType.DOCUMENT_GROUP, userId: data.userId },
      data,
    );
  }
}
