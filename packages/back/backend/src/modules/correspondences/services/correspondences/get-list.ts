import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, Repository } from "typeorm";

import { CorrespondenceEntity } from "entities/Correspondence/Correspondence";

@Injectable()
export class GetCorrespondencesListService {
  constructor(
    @InjectRepository(CorrespondenceEntity) private correspondenceRepository: Repository<CorrespondenceEntity>,
  ) {}

  async dangerGetCorrespondencesList(findOptions: FindManyOptions<CorrespondenceEntity>) {
    return await this.correspondenceRepository.find(findOptions);
  }
}
