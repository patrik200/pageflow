import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { GoalEntity } from "entities/Goal/";

import { getCurrentUser } from "modules/auth";

import { GoalCreated } from "../../event/GoalCreated";

interface CreateGoalInterface {
  name: string;
  description?: string;
  projectId: string;
}

@Injectable()
export class CreateGoalsService {
  constructor(
    @InjectRepository(GoalEntity) private goalsRepository: Repository<GoalEntity>,
    private eventEmitter: EventEmitter2,
  ) {}

  @Transactional()
  async createGoalOrFail(data: CreateGoalInterface) {

    const savedGoal = await this.goalsRepository.save({
      name: data.name,
      description: data.description,
      project: { id: data.projectId },
      implemented: false,
    });

    this.eventEmitter.emit(GoalCreated.eventName, new GoalCreated(savedGoal));

    return savedGoal.id;
  }
}
