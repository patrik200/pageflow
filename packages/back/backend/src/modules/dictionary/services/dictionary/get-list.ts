import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

import { DictionaryEntity } from "entities/Dictionary/Dictionary";

import { dictionariesFixture } from "fixtures/dictionaries";

import { getCurrentUser } from "modules/auth";

@Injectable()
export class GetDictionaryListService {
  constructor(
    @InjectRepository(DictionaryEntity)
    private dictionaryRepository: Repository<DictionaryEntity>,
  ) {}

  async getDictionariesListOrFail(options: { loadValues?: boolean } = {}) {
    const dictionaries = await this.dictionaryRepository.find({
      where: { client: { id: getCurrentUser().clientId } },
      order: { createdAt: "DESC" },
      relations: {
        client: true,
        values: options.loadValues,
      },
    });
    dictionaries.forEach((dictionary) => {
      dictionary.required = dictionariesFixture.get(dictionary.type)!.required;
    });
    dictionaries.forEach((dictionary) => dictionary.values.sort((a, b) => a.sort - b.sort));
    return dictionaries;
  }
}
