import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { InjectRepository } from "@nestjs/typeorm";
import { TimepointEntity } from "entities/Timepoint";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { TimepointCreated } from "../../event/TimePointCreated";

interface CreateTimepointInterface {
    name: string;
    description?: string;
    goalId: string;
    startDatePlan: Date;
    startDateFact: Date;
}

@Injectable()
export class TimepointCreateService {
    constructor(
        @InjectRepository(TimepointEntity) private timepointsRepository: Repository<TimepointEntity>,
        private eventEmitter: EventEmitter2,
    ) { }

    @Transactional()
    async createTimepointOrFail(data: CreateTimepointInterface) {
        const savedTimePoint = await this.timepointsRepository.save({
            name: data.name,
            description: data.description,
            goal: { id: data.goalId },
            startDatePlan: data.startDatePlan,
            startDateFact: data.startDateFact,
        });

        this.eventEmitter.emit(TimepointCreated.eventName, new TimepointCreated(savedTimePoint));

        return savedTimePoint.id;
    }
}
