import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { DictionaryValueEntity } from "entities/Dictionary/Dictionary";

import { getCurrentUser } from "modules/auth";

@Injectable()
export class EditSortDictionaryValueService {
  constructor(
    @InjectRepository(DictionaryValueEntity)
    private dictionaryValueRepository: Repository<DictionaryValueEntity>,
  ) {}

  @Transactional()
  async updateDictionaryValueSortOrFail(dictionaryId: string, dictionaryValueKeys: string[]) {
    const { clientId } = getCurrentUser();
    for (let i = 0; i < dictionaryValueKeys.length; i++) {
      await this.dictionaryValueRepository.update(
        {
          dictionary: { id: dictionaryId, client: { id: clientId } },
          key: dictionaryValueKeys[i],
        },
        { sort: i },
      );
    }
  }
}
