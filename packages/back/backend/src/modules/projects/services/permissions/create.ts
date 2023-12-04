import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { PermissionEntityType } from "@app/shared-enums";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { CreatePermissionInterface, CreatePermissionService } from "modules/permissions";

import { GetProjectService } from "../projects/get";
import { ProjectUpdated } from "../../events/ProjectUpdated";

@Injectable()
export class CreateProjectPermissionsService {
  constructor(
    private getProjectService: GetProjectService,
    @Inject(forwardRef(() => CreatePermissionService)) private createPermissionService: CreatePermissionService,
    private eventEmitter: EventEmitter2,
  ) {}

  async createProjectPermission(projectId: string, data: CreatePermissionInterface) {
    const project = await this.getProjectService.getProjectOrFail(projectId, { loadPermissions: true });

    await this.createPermissionService.createPermissionOrFail(
      { entityId: project.id, entityType: PermissionEntityType.PROJECT },
      data,
      { validateCurrentUserPermissions: true },
    );

    this.eventEmitter.emit(ProjectUpdated.eventName, new ProjectUpdated(project.id, project));
  }
}
