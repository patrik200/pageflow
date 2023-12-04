import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { PermissionEntityType } from "@app/shared-enums";

import { DeletePermissionService } from "modules/permissions";

import { GetCorrespondenceGroupService } from "../get";

@Injectable()
export class DeleteCorrespondenceGroupPermissionsService {
  constructor(
    private getCorrespondenceGroupService: GetCorrespondenceGroupService,
    @Inject(forwardRef(() => DeletePermissionService)) private deletePermissionService: DeletePermissionService,
  ) {}

  async deleteCorrespondenceGroupPermission(groupId: string, data: { userId: string }) {
    await this.getCorrespondenceGroupService.getGroupOrFail(groupId);

    await this.deletePermissionService.deletePermissionOrFail({
      entityId: groupId,
      entityType: PermissionEntityType.CORRESPONDENCE_GROUP,
      userId: data.userId,
    });
  }
}
