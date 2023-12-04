import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { PermissionEntityType } from "@app/shared-enums";

import { PermissionAccessService, PermissionSelectOptions } from "modules/permissions";

import { GetProjectService } from "../projects/get";

@Injectable()
export class GetProjectPermissionsService {
  constructor(
    private getProjectService: GetProjectService,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
  ) {}

  async getProjectPermissions(projectId: string, selectOptions?: PermissionSelectOptions) {
    await this.getProjectService.getProjectOrFail(projectId);

    return await this.permissionAccessService.getPermissions(
      { entityId: projectId, entityType: PermissionEntityType.PROJECT },
      selectOptions,
    );
  }
}
