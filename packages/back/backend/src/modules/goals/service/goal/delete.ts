import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { GoalEntity } from "entities/Goal";

export class DeleteGoalService {
  constructor(@InjectRepository(GoalEntity) private goalsRepository: Repository<GoalEntity>) {}

  async deleteGoalOrFail(id: string) {
    const originalGoal = await this.goalsRepository.findOne({ where: { id } });
    await this.goalsRepository.delete(originalGoal!.id);
  }
}
