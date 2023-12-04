import { Injectable } from "@nestjs/common";
import { FindManyOptions, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { DocumentGroupEntity } from "entities/Document/Group/group";

@Injectable()
export class GetDocumentGroupsListService {
  constructor(
    @InjectRepository(DocumentGroupEntity) private documentGroupRepository: Repository<DocumentGroupEntity>,
  ) {}

  async dangerGetGroupsOrFail(findOptions: FindManyOptions<DocumentGroupEntity>) {
    return await this.documentGroupRepository.find(findOptions);
  }
}
