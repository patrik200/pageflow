import { Injectable } from "@nestjs/common";
import { FindManyOptions, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { DocumentEntity } from "entities/Document/Document";

@Injectable()
export class GetDocumentsListService {
  constructor(@InjectRepository(DocumentEntity) private documentRepository: Repository<DocumentEntity>) {}

  async dangerGetDocuments(findOptions: FindManyOptions<DocumentEntity>) {
    return await this.documentRepository.find(findOptions);
  }
}
