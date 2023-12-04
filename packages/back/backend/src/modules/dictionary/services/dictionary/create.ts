import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { DictionaryTypes } from "@app/shared-enums";

import { DictionaryEntity } from "entities/Dictionary/Dictionary";

import { getCurrentUser } from "modules/auth";

interface CreateDictionaryInterface {
  type: DictionaryTypes;
}

@Injectable()
export class CreateDictionaryService {
  constructor(@InjectRepository(DictionaryEntity) private dictionaryRepository: Repository<DictionaryEntity>) {}

  @Transactional()
  async createDictionaryOrFail(data: CreateDictionaryInterface) {
    const dictionary = await this.dictionaryRepository.save({
      client: { id: getCurrentUser().clientId },
      type: data.type,
    });

    return dictionary.id;
  }
}
