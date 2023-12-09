import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { FindOptionsWhere } from "typeorm/find-options/FindOptionsWhere";
import { TimePointEntity } from "entities/TimePoint";

interface GetTimePointsListQueryInterface {
    goalId?: string
}
export interface TimePointSelectOptions {
    loadGoal?: boolean;
  }


@Injectable()
export class GetTimePointsListService {
  constructor(
    @InjectRepository(TimePointEntity) private timePointRepository: Repository<TimePointEntity>,
  ) {}

  async getTimePointsListOrFail(query: GetTimePointsListQueryInterface, options?: TimePointSelectOptions) {
    const findOptions: FindOptionsWhere<TimePointEntity> = {};
    
    if (query.goalId) findOptions.goal = {id: query.goalId}

    const timePoint: TimePointEntity[] & { favourite?: boolean; } =
      await this.timePointRepository.find({
        where: findOptions,
        ...options
      });
    return timePoint;
  }
}
