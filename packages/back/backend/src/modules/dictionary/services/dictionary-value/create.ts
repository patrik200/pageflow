import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { DictionaryValueEntity } from "entities/Dictionary/Dictionary";

import { getCurrentUser } from "modules/auth";

interface CreateDictionaryValueInterface {
  key: string;
  value: string;
  canDelete: boolean;
}

@Injectable()
export class CreateDictionaryValueService {
  constructor(
    @InjectRepository(DictionaryValueEntity)
    private dictionaryValueRepository: Repository<DictionaryValueEntity>,
  ) {}

  @Transactional()
  async createDictionaryValueOrFail(dictionaryId: string, data: CreateDictionaryValueInterface) {
    const valuesCount = await this.dictionaryValueRepository.count({
      where: { dictionary: { id: dictionaryId, client: { id: getCurrentUser().clientId } } },
    });

    const dictionaryValue = await this.dictionaryValueRepository.save({
      dictionary: { id: dictionaryId, client: { id: getCurrentUser().clientId } },
      key: data.key,
      value: data.value,
      canDelete: data.canDelete,
      sort: valuesCount,
    });

    return dictionaryValue.id;
  }
}
