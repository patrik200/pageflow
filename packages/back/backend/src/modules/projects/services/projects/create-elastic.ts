import { ElasticService } from "@app/back-kit";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ProjectEntity } from "entities/Project";

@Injectable()
export class CreateProjectElasticService {
  constructor(
    @InjectRepository(ProjectEntity) private projectRepository: Repository<ProjectEntity>,
    private elasticService: ElasticService,
  ) {}

  async elasticCreateProjectIndexOrFail(projectId: string, refreshIndex?: boolean) {
    const project = await this.projectRepository.findOneOrFail({
      where: { id: projectId },
      relations: { contractor: true, author: true, client: true, responsible: true },
    });

    await this.elasticService.addDocumentOrFail(
      this.elasticService.getDocumentId("projects", project.id, "project"),
      {
        clientId: project.client.id,
        authorId: project.author.id,
        status: project.status,
        contractorId: project.contractor?.id,
        responsibleId: project.responsible?.id,
        name: project.name,
        description: project.description ?? undefined,
        startDatePlan: project.startDatePlan?.toISOString(),
        startDateForecast: project.startDateForecast?.toISOString(),
        startDateFact: project.startDateFact?.toISOString(),
        endDatePlan: project.endDatePlan?.toISOString(),
        endDateForecast: project.endDateForecast?.toISOString(),
        endDateFact: project.endDateFact?.toISOString(),
        isPrivate: project.isPrivate,
      },
      refreshIndex,
    );
  }
}
