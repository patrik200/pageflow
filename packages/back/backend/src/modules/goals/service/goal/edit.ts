import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { TypeormUpdateEntity } from "@app/back-kit";

import { GoalEntity } from "entities/Goal";

interface EditGoalInterface {
  name?: string;
  description?: string;
  implemented?: boolean;
}

@Injectable()
export class GoalEditService {
  constructor(@InjectRepository(GoalEntity) private goalsRepository: Repository<GoalEntity>) {}

  @Transactional()
  async editGoalOrFail(id: string, data: EditGoalInterface) {
    const originalGoal = await this.goalsRepository.findOne({ where: { id } });
    const updateData: TypeormUpdateEntity<GoalEntity> = { ...data };
    if (data.name) updateData.name = data.name;
    if (data.description) updateData.description = data.description;
    await this.goalsRepository.update(originalGoal!.id, updateData);
  }
}
