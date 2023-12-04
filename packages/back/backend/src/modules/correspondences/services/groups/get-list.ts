import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, Repository } from "typeorm";

import { CorrespondenceGroupEntity } from "entities/Correspondence/Group/group";

@Injectable()
export class GetCorrespondenceGroupsListService {
  constructor(
    @InjectRepository(CorrespondenceGroupEntity)
    private correspondenceGroupRepository: Repository<CorrespondenceGroupEntity>,
  ) {}

  async dangerGetGroupsList(findOptions: FindManyOptions<CorrespondenceGroupEntity>) {
    return await this.correspondenceGroupRepository.find(findOptions);
  }
}
