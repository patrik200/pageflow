import { ElasticDocumentData, ElasticService, TypeormUpdateEntity, typeormUpdateNullOrUndefined } from "@app/back-kit";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { PermissionEntityType, PermissionRole } from "@app/shared-enums";
import { isNil } from "@worksolutions/utils";

import { ProjectEntity } from "entities/Project";

import { CreatePermissionService } from "modules/permissions";
import { GetUserService } from "modules/users";

import { GetProjectService } from "./get";
import { ProjectUpdated } from "../../events/ProjectUpdated";

interface UpdateProjectInterface {
  name?: string | null;
  description?: string | null;
  contractorId?: string | null;
  responsibleId?: string | null;
  startDatePlan?: Date | null;
  startDateForecast?: Date | null;
  startDateFact?: Date | null;
  endDatePlan?: Date | null;
  endDateForecast?: Date | null;
  endDateFact?: Date | null;
  isPrivate?: boolean;
  notifyInDays?: number | null;
}

@Injectable()
export class EditProjectService {
  constructor(
    @InjectRepository(ProjectEntity) private projectRepository: Repository<ProjectEntity>,
    private getProjectService: GetProjectService,
    private elasticService: ElasticService,
    private eventEmitter: EventEmitter2,
    @Inject(forwardRef(() => CreatePermissionService)) private createPermissionService: CreatePermissionService,
    @Inject(forwardRef(() => GetUserService)) private getUserService: GetUserService,
  ) {}

  @Transactional()
  async updateProjectOrFail(projectId: string, data: UpdateProjectInterface) {
    const project = await this.getProjectService.getProjectOrFail(projectId, { loadPreview: true });

    const commonUpdateOptions: TypeormUpdateEntity<ProjectEntity> = { updateCount: () => '"updateCount" + 1' };
    if (data.name) commonUpdateOptions.name = data.name;
    if (data.description) commonUpdateOptions.description = data.description;
    if (data.startDatePlan !== undefined) commonUpdateOptions.startDatePlan = data.startDatePlan;
    if (data.startDateForecast !== undefined) commonUpdateOptions.startDateForecast = data.startDateForecast;
    if (data.startDateFact !== undefined) commonUpdateOptions.startDateFact = data.startDateFact;
    if (data.endDatePlan !== undefined) commonUpdateOptions.endDatePlan = data.endDatePlan;
    if (data.endDateForecast !== undefined) commonUpdateOptions.endDateForecast = data.endDateForecast;
    if (data.endDateFact !== undefined) commonUpdateOptions.endDateFact = data.endDateFact;
    if (data.isPrivate !== undefined) commonUpdateOptions.isPrivate = data.isPrivate;

    const dbUpdateOptions: TypeormUpdateEntity<ProjectEntity> = { ...commonUpdateOptions };
    if (data.notifyInDays !== undefined) {
      dbUpdateOptions.notifiedInDays = false;
      dbUpdateOptions.notifyInDays = data.notifyInDays;
    }
    if (data.endDatePlan !== undefined) {
      dbUpdateOptions.notifiedAfterEndDatePlan = false;
    }

    const responsible = isNil(data.responsibleId)
      ? data.responsibleId
      : await this.getUserService.getUserOrFail(data.responsibleId, "id");

    if (responsible) {
      await this.createPermissionService.createPermissionOrFail(
        { entityId: project.id, entityType: PermissionEntityType.PROJECT },
        { userId: responsible.id, role: PermissionRole.EDITOR, canEditEditorPermissions: true },
        { validateCurrentUserPermissions: true },
      );
    }

    Object.assign(
      dbUpdateOptions,
      typeormUpdateNullOrUndefined<string>(data.contractorId, "contractor"),
      typeormUpdateNullOrUndefined<string>(data.responsibleId, "responsible", responsible?.id),
    );

    await this.projectRepository.update(project.id, dbUpdateOptions);

    await this.elasticService.updateDocumentOrFail(
      this.elasticService.getDocumentId("projects", project.id, "project"),
      Object.assign(
        {},
        commonUpdateOptions,
        this.elasticService.updateNullOrUndefined<string>(data.contractorId, "contractorId"),
        this.elasticService.updateNullOrUndefined<string>(data.responsibleId, "responsibleId", responsible?.id),
      ) as ElasticDocumentData,
    );

    this.eventEmitter.emit(ProjectUpdated.eventName, new ProjectUpdated(project.id, project));
  }
}
