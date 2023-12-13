import { InjectRepository } from "@nestjs/typeorm";
import { TimePointEntity } from "entities/TimePoint";
import { Repository } from "typeorm";

export class DeleteTimePointService {
    constructor(
        @InjectRepository(TimePointEntity) private timePointsRepository: Repository<TimePointEntity>,
      ) {}

    async deleteTimePointOrFail(id: string) {
        const originalTimePoint = await this.timePointsRepository.findOne({ where: { id } });
        await this.timePointsRepository.delete(originalTimePoint!.id);
    }
}