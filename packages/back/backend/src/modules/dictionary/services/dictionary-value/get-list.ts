import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { typeormAlias } from "@app/back-kit";
import { DictionaryTypes } from "@app/shared-enums";
import { Injectable } from "@nestjs/common";

import { DictionaryValueEntity } from "entities/Dictionary/Dictionary";

import { getCurrentUser } from "modules/auth";

@Injectable()
export class GetDictionaryValuesListService {
  constructor(
    @InjectRepository(DictionaryValueEntity)
    private dictionaryValueRepository: Repository<DictionaryValueEntity>,
  ) {}

  async getDictionaryValuesListOrFail(dictionaryType: DictionaryTypes) {
    return await this.dictionaryValueRepository.find({
      where: { dictionary: { type: dictionaryType, client: { id: getCurrentUser().clientId } } },
      order: { sort: "ASC" },
      join: { alias: typeormAlias, innerJoin: { dictionary: typeormAlias + ".dictionary" } },
    });
  }
}
