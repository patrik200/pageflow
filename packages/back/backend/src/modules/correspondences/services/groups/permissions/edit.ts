import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { PermissionEntityType } from "@app/shared-enums";

import { EditPermissionInterface, EditPermissionService } from "modules/permissions";

import { GetCorrespondenceGroupService } from "../get";

@Injectable()
export class EditCorrespondenceGroupPermissionsService {
  constructor(
    private getCorrespondenceGroupService: GetCorrespondenceGroupService,
    @Inject(forwardRef(() => EditPermissionService)) private editPermissionService: EditPermissionService,
  ) {}

  async editCorrespondenceGroupPermission(groupId: string, data: EditPermissionInterface & { userId: string }) {
    await this.getCorrespondenceGroupService.getGroupOrFail(groupId);

    await this.editPermissionService.editPermissionOrFail(
      { entityId: groupId, entityType: PermissionEntityType.CORRESPONDENCE_GROUP, userId: data.userId },
      data,
    );
  }
}
