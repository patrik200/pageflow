import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { InjectRepository } from "@nestjs/typeorm";
import { TimePointEntity } from "entities/TimePoint";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { TimePointCreated } from "../../event/TimePointCreated";

interface CreateTimePointInterface {
    name: string;
    description?: string;
    goalId: string;
    startDatePlan: Date;
    startDateFact: Date;
}

@Injectable()
export class TimePointCreateService {
    constructor(
        @InjectRepository(TimePointEntity) private goalsRepository: Repository<TimePointEntity>,
        private eventEmitter: EventEmitter2,
      ) {}
      @Transactional()
    async createTimePointOrFail(data: CreateTimePointInterface) {

    const savedTimePoint = await this.goalsRepository.save({
      name: data.name,
      description: data.description,
      goal: { id: data.goalId },
      startDatePlan: data.startDatePlan,
      startDateFact: data.startDateFact,
    });

    this.eventEmitter.emit(TimePointCreated.eventName, new TimePointCreated(savedTimePoint));

    return savedTimePoint.id;
  }
}
