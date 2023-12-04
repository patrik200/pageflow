import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { PermissionEntityType } from "@app/shared-enums";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ServiceError } from "@app/back-kit";

import { DeletePermissionService } from "modules/permissions";

import { GetProjectService } from "../projects/get";
import { ProjectUpdated } from "../../events/ProjectUpdated";

@Injectable()
export class DeleteProjectPermissionsService {
  constructor(
    private getProjectService: GetProjectService,
    @Inject(forwardRef(() => DeletePermissionService)) private deletePermissionService: DeletePermissionService,
    private eventEmitter: EventEmitter2,
  ) {}

  async deleteProjectPermission(projectId: string, data: { userId: string }) {
    const project = await this.getProjectService.getProjectOrFail(projectId, { loadPermissions: true });

    if (project.responsible?.id === data.userId)
      throw new ServiceError("permissions", "Нельзя удалить доступ ответственного сотрудника");

    await this.deletePermissionService.deletePermissionOrFail({
      entityId: project.id,
      entityType: PermissionEntityType.PROJECT,
      userId: data.userId,
    });

    this.eventEmitter.emit(ProjectUpdated.eventName, new ProjectUpdated(project.id, project));
  }
}
