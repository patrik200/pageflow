import { ServiceError, StorageSaveService } from "@app/back-kit";
import { PermissionEntityType, PermissionRole } from "@app/shared-enums";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { slugify } from "transliteration";

import { ProjectEntity } from "entities/Project";

import { getCurrentUser } from "modules/auth";
import { CreateCorrespondenceRootGroupService } from "modules/correspondences";
import { CreateDocumentRootGroupService } from "modules/documents";
import { CreateTicketBoardService } from "modules/ticket-boards";
import { CreatePermissionInterface, CreatePermissionService } from "modules/permissions";
import { GetClientService } from "modules/clients/services/client/get";
import { EditClientService } from "modules/clients/services/client/edit";

import { CreateProjectElasticService } from "./create-elastic";
import { ProjectCreated } from "../../events/ProjectCreated";

interface CreateProjectInterface {
  name: string;
  description?: string;
  responsibleId?: string;
  contractorId?: string;
  startDatePlan?: Date;
  startDateForecast?: Date;
  startDateFact?: Date;
  endDatePlan?: Date;
  endDateForecast?: Date;
  endDateFact?: Date;
  isPrivate: boolean;
  notifyInDays: number | null;
}

@Injectable()
export class CreateProjectService {
  constructor(
    @InjectRepository(ProjectEntity) private projectRepository: Repository<ProjectEntity>,
    private storageSaveService: StorageSaveService,
    @Inject(forwardRef(() => CreateCorrespondenceRootGroupService))
    private createCorrespondenceRootGroupService: CreateCorrespondenceRootGroupService,
    @Inject(forwardRef(() => CreateDocumentRootGroupService))
    private createDocumentRootGroupService: CreateDocumentRootGroupService,
    private createProjectElasticService: CreateProjectElasticService,
    @Inject(forwardRef(() => GetClientService)) private getClientService: GetClientService,
    @Inject(forwardRef(() => EditClientService)) private editClientService: EditClientService,
    @Inject(forwardRef(() => CreateTicketBoardService)) private createTicketBoardService: CreateTicketBoardService,
    @Inject(forwardRef(() => CreatePermissionService)) private createPermissionService: CreatePermissionService,
    private eventEmitter: EventEmitter2,
  ) {}

  private getTicketBoardSlug(projectName: string, boardIndex: number) {
    const slug = slugify(projectName, {
      uppercase: true,
      trim: true,
      unknown: "",
      separator: "",
      allowedChars: "a-zA-Zа-яА-Я",
    });

    return slug.slice(0, 16) + "_" + boardIndex;
  }

  @Transactional()
  async createProjectOrFail(data: CreateProjectInterface) {
    const currentUser = getCurrentUser();
    const client = await this.getClientService.getCurrentClientOrFail();
    const savedProject = await this.projectRepository.save({
      client: { id: client.id },
      author: { id: currentUser.userId },
      name: data.name,
      responsible: data.responsibleId ? { id: data.responsibleId } : null,
      description: data.description,
      contractor: data.contractorId ? { id: data.contractorId } : null,
      startDatePlan: data.startDatePlan,
      startDateForecast: data.startDateForecast,
      startDateFact: data.startDateFact,
      endDatePlan: data.endDatePlan,
      endDateForecast: data.endDateForecast,
      endDateFact: data.endDateFact,
      isPrivate: data.isPrivate,
      notifyInDays: data.notifyInDays,
    });

    await this.editClientService.incrementCreatedProjectsCount();

    const permissions = new Map<string, Omit<CreatePermissionInterface, "userId">>();

    if (data.responsibleId)
      permissions.set(data.responsibleId, { role: PermissionRole.EDITOR, canEditEditorPermissions: true });

    permissions.set(currentUser.userId, { role: PermissionRole.OWNER });

    await Promise.all(
      [...permissions.entries()].map(async ([userId, member]) =>
        this.createPermissionService.createPermissionOrFail(
          { entityId: savedProject.id, entityType: PermissionEntityType.PROJECT },
          { ...member, userId },
          { validateCurrentUserPermissions: false },
        ),
      ),
    );

    const [correspondenceRootGroupId, documentRootGroupId] = await Promise.all([
      this.createCorrespondenceRootGroupService.createGroupOrFail(
        { projectId: savedProject.id },
        { name: "Root for project " + savedProject.id },
      ),
      this.createDocumentRootGroupService.createGroupOrFail(
        { projectId: savedProject.id },
        { name: "Root for project " + savedProject.id },
      ),
    ]);

    await this.projectRepository.update(savedProject.id, {
      correspondenceRootGroup: { id: correspondenceRootGroupId },
      documentRootGroup: { id: documentRootGroupId },
    });

    await Promise.all([
      this.createProjectBucket(),
      this.createProjectElasticService.elasticCreateProjectIndexOrFail(savedProject.id),
      this.createTicketBoardService.createTicketBoardOrFail(
        { projectId: savedProject.id },
        {
          isPrivate: data.isPrivate,
          name: data.name,
          slug: this.getTicketBoardSlug(savedProject.name, client.createdProjectsCount + 1),
          validateSlug: false,
        },
      ),
    ]);

    this.eventEmitter.emit(ProjectCreated.eventName, new ProjectCreated(savedProject.id));

    return savedProject.id;
  }

  private async createProjectBucket() {
    const createProjectBucketSuccess = await this.storageSaveService.createBucketIfNotExists(
      `client.${getCurrentUser().clientId}.projects`,
    );

    if (!createProjectBucketSuccess) throw new ServiceError("files", "Не удалось создать хранилище файлов [project]");
  }
}
