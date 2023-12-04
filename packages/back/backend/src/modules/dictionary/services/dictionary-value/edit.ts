import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { TypeormUpdateEntity } from "@app/back-kit";

import { DictionaryValueEntity } from "entities/Dictionary/Dictionary";

import { getCurrentUser } from "modules/auth";

interface UpdateDictionaryValueInterface {
  value?: string;
}

@Injectable()
export class EditDictionaryValueService {
  constructor(
    @InjectRepository(DictionaryValueEntity)
    private dictionaryValueRepository: Repository<DictionaryValueEntity>,
  ) {}

  @Transactional()
  async updateDictionaryValueOrFail(dictionaryId: string, key: string, data: UpdateDictionaryValueInterface) {
    const dictionaryValue = await this.dictionaryValueRepository.findOneOrFail({
      where: { key, dictionary: { id: dictionaryId, client: { id: getCurrentUser().clientId } } },
      relations: { dictionary: true },
    });

    const updateOptions: TypeormUpdateEntity<DictionaryValueEntity> = {};
    if (data.value) updateOptions.value = data.value;

    await this.dictionaryValueRepository.update({ id: dictionaryValue.id }, updateOptions);
  }
}
