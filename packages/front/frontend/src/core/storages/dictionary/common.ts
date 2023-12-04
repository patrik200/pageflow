import { METHODS } from "@app/kit";
import { Inject, Service } from "typedi";
import { action, computed, observable } from "mobx";
import { InternalRequestManager, parseServerError, Storage } from "@app/front-kit";
import { Expose, Type } from "class-transformer";
import { DictionaryTypes } from "@app/shared-enums";

import { arrayOfDictionaryEntitiesDecoder, DictionaryEntity } from "core/entities/dictionary/dictionary";

@Service()
export class DictionariesCommonStorage extends Storage {
  static token = "DictionariesCommonStorage";

  constructor() {
    super();
    this.initStorage(DictionariesCommonStorage.token);
  }

  @Inject() private requestManager!: InternalRequestManager;

  @observable @Expose() @Type(() => DictionaryEntity) dictionaries: DictionaryEntity[] = [];

  @action loadDictionaries = async () => {
    try {
      const { array } = await this.requestManager.createRequest({
        url: "/dictionaries",
        method: METHODS.GET,
        responseDataFieldPath: ["list"],
        serverDataEntityDecoder: arrayOfDictionaryEntitiesDecoder,
      })();
      this.dictionaries = array;
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @computed get documentTypeDictionary() {
    return this.dictionaries.find((dictionary) => dictionary.type === DictionaryTypes.DOCUMENT_TYPE)!;
  }

  @computed get ticketStatusDictionary() {
    return this.dictionaries.find((dictionary) => dictionary.type === DictionaryTypes.TICKET_STATUS)!;
  }

  @computed get documentRevisionReturnCodeDictionary() {
    return this.dictionaries.find((dictionary) => dictionary.type === DictionaryTypes.DOCUMENT_REVISION_RETURN_CODE)!;
  }

  @computed get ticketTypeDictionary() {
    return this.dictionaries.find((dictionary) => dictionary.type === DictionaryTypes.TICKET_TYPE)!;
  }
}
