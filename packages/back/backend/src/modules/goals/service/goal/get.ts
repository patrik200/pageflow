import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { GoalEntity } from "entities/Goal";

export interface GoalSelectOptions {
  loadTimepoints?: boolean;
  loadProject?: boolean;
  loadFavourites?: boolean;
}

@Injectable()
export class GetGoalService {
  constructor(@InjectRepository(GoalEntity) private goalRepository: Repository<GoalEntity>) { }

  async getGoalOrFail(goalId: string, { loadFavourites, ...options }: GoalSelectOptions = {}) {
    const goal: GoalEntity & { favourite?: boolean } = await this.goalRepository.findOneOrFail({
      where: { id: goalId },
      ...options,
    });

    return goal;
  }
}
