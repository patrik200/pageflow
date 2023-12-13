import { InjectRepository } from "@nestjs/typeorm";
import { TimepointEntity } from "entities/Timepoint";
import { Repository } from "typeorm";

export class DeleteTimepointService {
    constructor(@InjectRepository(TimepointEntity) private timepointsRepository: Repository<TimepointEntity>) { }

    async deleteTimepointOrFail(id: string) {
        const originalTimepoint = await this.timepointsRepository.findOne({ where: { id } });
        await this.timepointsRepository.delete(originalTimepoint!.id);
    }
}
