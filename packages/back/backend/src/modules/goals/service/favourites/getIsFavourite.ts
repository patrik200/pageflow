import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { GoalFavouriteEntity } from "entities/Goal/Goal/Favourire";

import { getCurrentUser } from "modules/auth";

@Injectable()
export class GetGoalIsFavouritesService {
  constructor(
    @InjectRepository(GoalFavouriteEntity)
    private goalFavouriteRepository: Repository<GoalFavouriteEntity>,
  ) {}

  async getGoalIsFavourite(goalId: string) {
    const favourite = await this.goalFavouriteRepository.findOne({
      where: { goal: { id: goalId }, user: { id: getCurrentUser().userId } },
    });

    return !!favourite;
  }
}
