import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { ServiceError } from "@app/back-kit";

import { DictionaryValueEntity } from "entities/Dictionary/Dictionary";

import { dictionariesFixture } from "fixtures/dictionaries";

import { getCurrentUser } from "modules/auth";
import { DictionaryValueDeleted } from "modules/dictionary/events/DictionaryValueDeleted";

@Injectable()
export class DeleteDictionaryValueService {
  constructor(
    private eventEmitter: EventEmitter2,
    @InjectRepository(DictionaryValueEntity) private dictionaryValueRepository: Repository<DictionaryValueEntity>,
  ) {}

  @Transactional()
  async deleteDictionaryValueOrFail(
    dictionaryId: string,
    dictionaryValueKey: string,
    options: { dictionaryValueReplaceKey?: string } = {},
  ) {
    const { clientId } = getCurrentUser();
    const dictionaryValue = await this.dictionaryValueRepository.findOneOrFail({
      where: { key: dictionaryValueKey, dictionary: { id: dictionaryId, client: { id: clientId } } },
      relations: { dictionary: true },
    });

    if (!dictionaryValue.canDelete) throw new ServiceError("dictionaryValue", "Эту опцию нельзя удалить");

    const dictionaryFixture = dictionariesFixture.get(dictionaryValue.dictionary.type)!;
    if (dictionaryFixture.required && !options.dictionaryValueReplaceKey)
      throw new ServiceError("dictionary", 'Не указана опция "dictionaryValueReplaceKey"');

    const event = new DictionaryValueDeleted({
      dictionaryValueId: dictionaryValue.id,
      dictionaryType: dictionaryValue.dictionary.type,
      replaceDictionaryValueKey: null,
    });

    if (options.dictionaryValueReplaceKey) {
      const dictionaryValueReplace = await this.dictionaryValueRepository.findOneOrFail({
        where: {
          key: options.dictionaryValueReplaceKey,
          dictionary: { id: dictionaryId, client: { id: clientId } },
        },
      });

      event.payload.replaceDictionaryValueKey = dictionaryValueReplace.key;
    }

    await this.eventEmitter.emitAsync(DictionaryValueDeleted.eventName, event);

    await this.dictionaryValueRepository.delete({ id: dictionaryValue.id });
  }
}
