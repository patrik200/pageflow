import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DictionaryTypes } from "@app/shared-enums";
import { Injectable } from "@nestjs/common";

import { DictionaryEntity } from "entities/Dictionary/Dictionary";

import { getCurrentUser } from "modules/auth";

@Injectable()
export class GetDictionaryService {
  constructor(
    @InjectRepository(DictionaryEntity)
    private dictionaryRepository: Repository<DictionaryEntity>,
  ) {}

  async getDictionaryByType(dictionaryType: DictionaryTypes) {
    return await this.dictionaryRepository.findOne({
      where: { client: { id: getCurrentUser().clientId }, type: dictionaryType },
      relations: {
        client: true,
      },
    });
  }
}
