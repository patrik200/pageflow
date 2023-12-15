import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere } from "typeorm/find-options/FindOptionsWhere";

import { GoalEntity } from "entities/Goal";

import { GetProjectService } from "modules/projects";

import { GoalSelectOptions } from "./get";
import { GetTimepointsListService } from "../timepoint/get-list";

interface GetGoalsListQueryInterface {
  projectId?: string;
}

@Injectable()
export class GetGoalsListService {
  constructor(
    @InjectRepository(GoalEntity) private goalRepository: Repository<GoalEntity>,
    private getTimepointsListService: GetTimepointsListService,
    @Inject(forwardRef(() => GetProjectService)) private getProjectService: GetProjectService,
  ) {}

  async getGoalsListOrFail(query: GetGoalsListQueryInterface, options?: GoalSelectOptions) {
    const findOptions: FindOptionsWhere<GoalEntity> = {};

    if (query.projectId) {
      const project = await this.getProjectService.getProjectOrFail(query.projectId, { checkPermissions: true });
      findOptions.project = { id: project.id };
    }

    const goals: GoalEntity[] & { favourite?: boolean } = await this.goalRepository.find({
      where: findOptions,
      ...options,
    });

    await Promise.all(
      goals.map(
        async (goal) =>
          (goal.timepoints = await this.getTimepointsListService.getTimePointsListOrFail({ goalId: goal.id })),
      ),
    );

    return goals;
  }
}
