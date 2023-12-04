import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { PermissionEntityType } from "@app/shared-enums";

import { CreatePermissionInterface, CreatePermissionService } from "modules/permissions";

import { GetCorrespondenceGroupService } from "../get";

@Injectable()
export class CreateCorrespondenceGroupPermissionsService {
  constructor(
    private getCorrespondenceGroupService: GetCorrespondenceGroupService,
    @Inject(forwardRef(() => CreatePermissionService)) private createPermissionService: CreatePermissionService,
  ) {}

  async createCorrespondenceGroupPermission(groupId: string, data: CreatePermissionInterface) {
    await this.getCorrespondenceGroupService.getGroupOrFail(groupId);

    await this.createPermissionService.createPermissionOrFail(
      { entityId: groupId, entityType: PermissionEntityType.CORRESPONDENCE_GROUP },
      data,
      { validateCurrentUserPermissions: true },
    );
  }
}
