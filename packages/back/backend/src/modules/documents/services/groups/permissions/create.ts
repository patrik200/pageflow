import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { PermissionEntityType } from "@app/shared-enums";

import { CreatePermissionInterface, CreatePermissionService } from "modules/permissions";

import { GetDocumentGroupService } from "../get";

@Injectable()
export class CreateDocumentGroupPermissionsService {
  constructor(
    private getDocumentGroupService: GetDocumentGroupService,
    @Inject(forwardRef(() => CreatePermissionService)) private createPermissionService: CreatePermissionService,
  ) {}

  async createDocumentGroupPermission(groupId: string, data: CreatePermissionInterface) {
    await this.getDocumentGroupService.getGroupOrFail(groupId);

    await this.createPermissionService.createPermissionOrFail(
      { entityId: groupId, entityType: PermissionEntityType.DOCUMENT_GROUP },
      data,
      { validateCurrentUserPermissions: true },
    );
  }
}
