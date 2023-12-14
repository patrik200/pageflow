import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { TypeormUpdateEntity } from "@app/back-kit";
import { GoalEntity } from "entities/Goal";
import { TimepointEntity } from "entities/Timepoint";

interface EditTimepointInterface {
    name?: string;
    description?: string;
    datePlan?: Date;
}

@Injectable()
export class TimepointEditService {
    constructor(@InjectRepository(TimepointEntity) private timepointsRepository: Repository<TimepointEntity>) { }

    @Transactional()
    async editTimepointOrFail(id: string, data: EditTimepointInterface) {
        const originalGoal = await this.timepointsRepository.findOne({ where: { id } });
        const updateData: TypeormUpdateEntity<TimepointEntity> = {};
        if (data.datePlan) updateData.datePlan = data.datePlan;
        if (data.name) updateData.name = data.name;
        if (data.description) updateData.description = data.description;
        await this.timepointsRepository.update(originalGoal!.id, updateData);
    }
}
