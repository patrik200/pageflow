import { ElasticService, ServiceError } from "@app/back-kit";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { PermissionEntityType } from "@app/shared-enums";

import { ProjectEntity } from "entities/Project";

import { DeleteDocumentRootGroupService } from "modules/documents";
import { DeleteCorrespondenceRootGroupService, MoveCorrespondenceRootGroupService } from "modules/correspondences";
import { DeleteTicketBoardService } from "modules/ticket-boards";
import { DeletePermissionService } from "modules/permissions";

import { DeleteProjectPreviewService } from "../preview/delete";
import { RemoveProjectFavouritesService } from "../favorite/remove";
import { GetProjectService } from "./get";
import { ProjectDeleted } from "../../events/ProjectDeleted";

interface DeleteProjectOptionsInterface {
  moveDocuments: boolean;
  moveCorrespondencesToClient: boolean;
  checkPermissions?: boolean;
  emitEvents?: boolean;
}

@Injectable()
export class DeleteProjectService {
  constructor(
    @InjectRepository(ProjectEntity) private projectRepository: Repository<ProjectEntity>,
    private getProjectService: GetProjectService,
    @Inject(forwardRef(() => DeleteDocumentRootGroupService))
    private deleteDocumentRootGroupService: DeleteDocumentRootGroupService,
    private elasticService: ElasticService,
    @Inject(forwardRef(() => MoveCorrespondenceRootGroupService))
    private moveCorrespondenceRootGroupService: MoveCorrespondenceRootGroupService,
    @Inject(forwardRef(() => DeleteCorrespondenceRootGroupService))
    private deleteCorrespondenceRootGroupService: DeleteCorrespondenceRootGroupService,
    @Inject(forwardRef(() => DeleteTicketBoardService))
    private deleteTicketBoardService: DeleteTicketBoardService,
    private deleteProjectPreviewService: DeleteProjectPreviewService,
    @Inject(forwardRef(() => DeletePermissionService)) private deletePermissionService: DeletePermissionService,
    private removeProjectFavouritesService: RemoveProjectFavouritesService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Transactional()
  private async moveCorrespondences(project: ProjectEntity, options: DeleteProjectOptionsInterface) {
    if (options.moveCorrespondencesToClient) {
      await this.moveCorrespondenceRootGroupService.moveRootGroupOrFail(
        { movableRootGroupId: project.correspondenceRootGroup.id },
        { name: project.name, isPrivate: false },
      );
    }

    await this.deleteCorrespondenceRootGroupService.deleteGroupOrFail(project.correspondenceRootGroup.id);
  }

  @Transactional()
  private async moveDocuments(project: ProjectEntity, options: DeleteProjectOptionsInterface) {
    if (options.moveDocuments) return;
    await this.deleteDocumentRootGroupService.deleteGroupOrFail(project.documentRootGroup.id);
  }

  @Transactional()
  private async deleteProjectPreview(project: ProjectEntity) {
    await this.deleteProjectPreviewService.deleteProjectPreviewOrFail(project.id, {
      checkPermissions: false,
      emitEvents: false,
    });
  }

  @Transactional()
  private async deleteProjectTicketBoards(project: ProjectEntity) {
    await Promise.all(
      project.ticketBoards.map((board) =>
        this.deleteTicketBoardService.deleteTicketBoardOrFail(board.id, { checkPermissions: false }),
      ),
    );
  }

  @Transactional()
  async deleteProjectOrFail(
    projectId: string,
    { checkPermissions = true, emitEvents = true, ...options }: DeleteProjectOptionsInterface,
  ) {
    const project = await this.getProjectService.getProjectOrFail(projectId, {
      loadDocumentRootGroup: true,
      loadCorrespondenceRootGroup: true,
      loadTicketBoards: true,
      checkPermissions,
    });

    if (options.moveDocuments) throw new ServiceError("moveDocuments", "Документы можно только удалить");

    await Promise.all([
      this.moveCorrespondences(project, options),
      this.moveDocuments(project, options),
      this.deleteProjectPreview(project),
      this.deleteProjectTicketBoards(project),
      this.removeProjectFavouritesService.removeFavouriteOrFail(project.id, { forAllUsers: true }),
    ]);

    await Promise.all([
      this.deletePermissionService.deleteAllPermissionsOrFail({
        entityId: project.id,
        entityType: PermissionEntityType.PROJECT,
      }),

      this.projectRepository.delete(project.id),
    ]);

    await this.elasticService.deleteIndexDocumentOrFail(
      this.elasticService.getDocumentId("projects", project.id, "project"),
    );

    if (emitEvents) this.eventEmitter.emit(ProjectDeleted.eventName, new ProjectDeleted(project.id));
  }
}
