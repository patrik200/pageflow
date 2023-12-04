import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { GoalEntity } from "entities/Goal/Goal";

import { FindOptionsWhere } from "typeorm/find-options/FindOptionsWhere";
import { GoalSelectOptions } from "./get";

interface GetGoalsListQueryInterface {
    projectId?: string
}

@Injectable()
export class GetGoalsListService {
  constructor(
    @InjectRepository(GoalEntity) private goalRepository: Repository<GoalEntity>,
  ) {}

  async getGoalsListOrFail(query: GetGoalsListQueryInterface, options?: GoalSelectOptions) {
    const findOptions: FindOptionsWhere<GoalEntity> = {};
    
    if (query.projectId) findOptions.project = {id: query.projectId}

    const goals: GoalEntity[] & { favourite?: boolean; } =
      await this.goalRepository.find({
        where: findOptions,
        ...options
      });
    console.log(goals)
    return goals;
  }
}