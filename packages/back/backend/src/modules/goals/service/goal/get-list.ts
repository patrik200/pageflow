import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { GoalEntity } from "entities/Goal";

import { FindOptionsWhere } from "typeorm/find-options/FindOptionsWhere";
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
  ) { }

  async getGoalsListOrFail(query: GetGoalsListQueryInterface, options?: GoalSelectOptions) {
    const findOptions: FindOptionsWhere<GoalEntity> = {};

    if (query.projectId) findOptions.project = { id: query.projectId };

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
