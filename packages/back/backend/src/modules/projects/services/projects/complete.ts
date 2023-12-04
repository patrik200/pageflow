import { ServiceError } from "@app/back-kit";
import { ProjectsStatus } from "@app/shared-enums";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { ProjectEntity } from "entities/Project";

import { GetProjectService } from "./get";
import { ProjectUpdated } from "../../events/ProjectUpdated";

@Injectable()
export class CompleteProjectsService {
  constructor(
    private getProjectsService: GetProjectService,
    @InjectRepository(ProjectEntity) private projectRepository: Repository<ProjectEntity>,
    private eventEmitter: EventEmitter2,
  ) {}

  @Transactional()
  async completeProjectOrFail(projectId: string) {
    const project = await this.getProjectsService.getProjectOrFail(projectId);

    if (!project.canMoveToCompletedStatus) throw new ServiceError("status", "Вы не можете завершить этот проект");

    await this.projectRepository.update(project.id, { status: ProjectsStatus.COMPLETED });

    this.eventEmitter.emit(ProjectUpdated.eventName, new ProjectUpdated(project.id, project));
  }
}
