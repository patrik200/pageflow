import { ExpressMultipartFile } from "@app/back-kit";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { PermissionEntityType } from "@app/shared-enums";

import { ProjectEntity } from "entities/Project";

import { getCurrentUser } from "modules/auth";
import { DeleteFileService, UploadFileService } from "modules/storage";
import { PermissionAccessService } from "modules/permissions";

import { GetProjectService } from "../projects/get";
import { ProjectUpdated } from "../../events/ProjectUpdated";

@Injectable()
export class EditProjectPreviewService {
  constructor(
    @InjectRepository(ProjectEntity) private projectRepository: Repository<ProjectEntity>,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
    private getProjectService: GetProjectService,
    private deleteFileService: DeleteFileService,
    private uploadFileService: UploadFileService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Transactional()
  async updateProjectPreviewOrFail(projectId: string, data: { file: ExpressMultipartFile }) {
    await this.permissionAccessService.validateToEditOrDelete(
      { entityId: projectId, entityType: PermissionEntityType.PROJECT },
      true,
    );

    const project = await this.getProjectService.getProjectOrFail(projectId, {
      loadPreview: true,
      checkPermissions: false,
    });
    if (project.preview) await this.deleteFileService.deleteFileOrFail(project.preview);

    const savedFile = await this.uploadFileService.uploadFileOrFail(
      `client.${getCurrentUser().clientId}.projects`,
      data.file,
    );

    await this.projectRepository.update(projectId, {
      preview: { id: savedFile.id },
    });

    this.eventEmitter.emit(ProjectUpdated.eventName, new ProjectUpdated(project.id, project));

    return savedFile;
  }
}
