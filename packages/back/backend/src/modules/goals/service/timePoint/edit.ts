import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { TypeormUpdateEntity } from "@app/back-kit"
import { GoalEntity } from "entities/Goal";
import { TimePointEntity } from "entities/TimePoint";


interface EditTimePointInterface {
    name?: string
    description?: string
    implemented?: boolean
}

@Injectable()
export class TimePointEditService {
    constructor(
        @InjectRepository(TimePointEntity) private timePointsRepository: Repository<TimePointEntity>,
      ) {}

    @Transactional()
    async editTimePointOrFail(id: string, data: EditTimePointInterface ) {
        const originalGoal = await this.timePointsRepository.findOne({ where: { id } });
        const updateData: TypeormUpdateEntity<GoalEntity> = {...data}
        await this.timePointsRepository.update(originalGoal!.id, updateData);
    }
}
