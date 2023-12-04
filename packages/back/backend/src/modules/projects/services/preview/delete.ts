import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { PermissionEntityType } from "@app/shared-enums";

import { ProjectEntity } from "entities/Project";

import { DeleteFileService } from "modules/storage";
import { PermissionAccessService } from "modules/permissions";

import { GetProjectService } from "../projects/get";
import { ProjectUpdated } from "../../events/ProjectUpdated";

@Injectable()
export class DeleteProjectPreviewService {
  constructor(
    @InjectRepository(ProjectEntity) private projectRepository: Repository<ProjectEntity>,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
    private getProjectService: GetProjectService,
    private deleteFileService: DeleteFileService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Transactional()
  async deleteProjectPreviewOrFail(
    projectId: string,
    { checkPermissions = true, emitEvents = true }: { checkPermissions?: boolean; emitEvents?: boolean } = {},
  ) {
    if (checkPermissions)
      await this.permissionAccessService.validateToEditOrDelete(
        { entityId: projectId, entityType: PermissionEntityType.PROJECT },
        true,
      );

    const project = await this.getProjectService.getProjectOrFail(projectId, {
      loadPreview: true,
      checkPermissions: false,
    });
    if (!project.preview) return;

    await this.deleteFileService.deleteFileOrFail(project.preview);
    await this.projectRepository.update(projectId, { preview: null });

    if (emitEvents) {
      this.eventEmitter.emit(ProjectUpdated.eventName, new ProjectUpdated(project.id, project));
    }
  }
}
