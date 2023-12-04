import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { PermissionEntityType } from "@app/shared-enums";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ServiceError } from "@app/back-kit";

import { EditPermissionInterface, EditPermissionService } from "modules/permissions";

import { GetProjectService } from "../projects/get";
import { ProjectUpdated } from "../../events/ProjectUpdated";

@Injectable()
export class EditProjectPermissionsService {
  constructor(
    private getProjectService: GetProjectService,
    @Inject(forwardRef(() => EditPermissionService)) private editPermissionService: EditPermissionService,
    private eventEmitter: EventEmitter2,
  ) {}

  async editTicketBoardPermission(projectId: string, data: EditPermissionInterface & { userId: string }) {
    const project = await this.getProjectService.getProjectOrFail(projectId, { loadPermissions: true });

    if (project.responsible?.id === data.userId)
      throw new ServiceError("permissions", "Нельзя редактировать доступ ответственного сотрудника");

    await this.editPermissionService.editPermissionOrFail(
      { entityId: project.id, entityType: PermissionEntityType.PROJECT, userId: data.userId },
      data,
    );

    this.eventEmitter.emit(ProjectUpdated.eventName, new ProjectUpdated(project.id, project));
  }
}
