import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { typeormAlias } from "@app/back-kit";
import { DictionaryTypes } from "@app/shared-enums";
import { Injectable } from "@nestjs/common";

import { DictionaryValueEntity } from "entities/Dictionary/Dictionary";

import { getCurrentUser } from "modules/auth";

@Injectable()
export class GetDictionaryValueService {
  constructor(
    @InjectRepository(DictionaryValueEntity) private dictionaryValueRepository: Repository<DictionaryValueEntity>,
  ) {}

  async getDictionaryValueOrFail(key: string, dictionaryType: DictionaryTypes) {
    return await this.dictionaryValueRepository.findOneOrFail({
      where: { key, dictionary: { type: dictionaryType, client: { id: getCurrentUser().clientId } } },
      join: { alias: typeormAlias, innerJoin: { dictionary: typeormAlias + ".dictionary" } },
    });
  }

  async dangerGetDictionaryValueOrFail(key: string, dictionaryType: DictionaryTypes) {
    return await this.dictionaryValueRepository.findOneOrFail({
      where: { key, dictionary: { type: dictionaryType } },
      join: { alias: typeormAlias, innerJoin: { dictionary: typeormAlias + ".dictionary" } },
    });
  }
}
