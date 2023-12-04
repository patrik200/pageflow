import { forwardRef, Inject, Injectable, LoggerService } from "@nestjs/common";
import { DictionaryTypes } from "@app/shared-enums";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ClientEntity } from "entities/Client";

import { dictionariesFixture, dictionaryValuesFixture } from "fixtures/dictionaries";

import { GetDictionaryService, CreateDictionaryService, CreateDictionaryValueService } from "modules/dictionary";
import { currentUserStorage, emptyCurrentUserStorageValue } from "modules/auth";

@Injectable()
export class AddFixtureToClientCommand {
  constructor(
    @Inject(forwardRef(() => CreateDictionaryService)) private createDictionaryService: CreateDictionaryService,
    @Inject(forwardRef(() => CreateDictionaryValueService))
    private createDictionaryValueService: CreateDictionaryValueService,
    @Inject(forwardRef(() => GetDictionaryService)) private getDictionaryService: GetDictionaryService,
    @InjectRepository(ClientEntity) private clientRepository: Repository<ClientEntity>,
  ) {}

  private getDictionaryType(dictionaryTypeRaw: string) {
    const entries = Object.entries(DictionaryTypes);
    for (const [key, value] of entries) {
      if (value === dictionaryTypeRaw) return DictionaryTypes[key as keyof typeof DictionaryTypes];
    }
  }

  async addDictionaryToClient(clientId: string, dictionaryTypeRaw: string, logger: LoggerService = console) {
    const dictionaryType = this.getDictionaryType(dictionaryTypeRaw);
    if (!dictionaryType) {
      logger.error(`Invalid dictionary type ${dictionaryTypeRaw}`, "fixtures");
      return;
    }

    const client = await this.clientRepository.findOne({ where: { id: clientId } });

    if (!client) {
      logger.error(`Client not found ${clientId}`, "fixtures");
      return;
    }

    await currentUserStorage.run({ ...emptyCurrentUserStorageValue, clientId }, async () => {
      if (await this.getDictionaryService.getDictionaryByType(dictionaryType)) return;

      const dictionaryFixture = dictionariesFixture.get(dictionaryType)!;

      const newDictionaryId = await this.createDictionaryService.createDictionaryOrFail({
        type: dictionaryType,
        ...dictionaryFixture,
      });

      for (const [key, { value, canDelete }] of dictionaryValuesFixture.get(dictionaryType)!.entries()) {
        await this.createDictionaryValueService.createDictionaryValueOrFail(newDictionaryId, {
          key,
          value: value["ru"],
          canDelete,
        });
      }
    });

    logger.log("Success", "fixtures");
  }
}
