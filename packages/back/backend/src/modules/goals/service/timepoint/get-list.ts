import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { FindOptionsWhere } from "typeorm/find-options/FindOptionsWhere";
import { TimepointEntity } from "entities/Timepoint";

interface GetTimePointsListQueryInterface {
  goalId?: string;
}
export interface TimePointSelectOptions {
  loadGoal?: boolean;
}

@Injectable()
export class GetTimepointsListService {
  constructor(@InjectRepository(TimepointEntity) private timepointRepository: Repository<TimepointEntity>) { }

  async getTimePointsListOrFail(query: GetTimePointsListQueryInterface, options?: TimePointSelectOptions) {
    const findOptions: FindOptionsWhere<TimepointEntity> = {};

    if (query.goalId) findOptions.goal = { id: query.goalId };

    const timePoint: TimepointEntity[] & { favourite?: boolean } = await this.timepointRepository.find({
      where: findOptions,
      ...options,
    });
    return timePoint;
  }
}
