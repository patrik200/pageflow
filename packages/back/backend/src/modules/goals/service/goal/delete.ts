import { InjectRepository } from "@nestjs/typeorm";
import { GoalEntity } from "entities/Goal";
import { Repository } from "typeorm";

export class DeleteGoalService {
    constructor(@InjectRepository(GoalEntity) private goalsRepository: Repository<GoalEntity>) {}

    async deleteGoalOrFail(id: string) {
        const originalGoal = await this.goalsRepository.findOne({ where: { id } });
        await this.goalsRepository.delete(originalGoal!.id);
    }
}