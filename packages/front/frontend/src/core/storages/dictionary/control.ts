import { entityGetter, METHODS } from "@app/kit";
import { Inject, Service } from "typedi";
import { action } from "mobx";
import { InternalRequestManager, parseServerError, Storage } from "@app/front-kit";

import { DictionaryValueEntity } from "core/entities/dictionary/dictionary";

import { DictionariesCommonStorage } from "./common";
import { EditDictionaryValueEntity } from "./entities/EditDictionaryValue";

@Service()
export class DictionariesControlStorage extends Storage {
  static token = "DictionariesControlStorage";

  constructor() {
    super();
    this.initStorage(DictionariesControlStorage.token);
  }

  @Inject() private requestManager!: InternalRequestManager;
  @Inject() private dictionariesCommonStorage!: DictionariesCommonStorage;

  @action createValue = async (value: EditDictionaryValueEntity) => {
    try {
      await this.requestManager.createRequest({
        url: "/dictionaries/{id}/values",
        method: METHODS.POST,
        responseDataFieldPath: ["list"],
      })({ body: value.apiCreateReady, urlParams: { id: value.dictionary.id } });
      await this.dictionariesCommonStorage.loadDictionaries();
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action editValue = async (value: EditDictionaryValueEntity) => {
    try {
      await this.requestManager.createRequest({
        url: "/dictionaries/{dictionaryId}/values/{key}",
        method: METHODS.PATCH,
      })({ body: value.apiUpdateReady, urlParams: { dictionaryId: value.dictionary.id, key: value.key } });
      await this.dictionariesCommonStorage.loadDictionaries();
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action deleteValue = async (dictionaryId: string, value: DictionaryValueEntity, replaceValueKey: string | null) => {
    try {
      await this.requestManager.createRequest({
        url: "/dictionaries/{dictionaryId}/values/{valueKey}/{replaceValueKey}",
        method: METHODS.DELETE,
      })({
        urlParams: { dictionaryId: dictionaryId, valueKey: value.key, replaceValueKey: replaceValueKey ?? "" },
      });
      await this.dictionariesCommonStorage.loadDictionaries();
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action reorderValues = async (dictionaryId: string, newKeysOrder: string[]) => {
    const dictionary = entityGetter(this.dictionariesCommonStorage.dictionaries, dictionaryId, "id");
    if (!dictionary) return { success: false, error: false } as const;

    try {
      dictionary.entity.reorderValues(newKeysOrder);
      await this.requestManager.createRequest({
        url: "/dictionaries/{dictionaryId}/values/sort",
        method: METHODS.POST,
      })({ body: { keys: newKeysOrder }, urlParams: { dictionaryId } });
      return { success: true } as const;
    } catch (error) {
      await this.dictionariesCommonStorage.loadDictionaries();
      return { success: false, error: parseServerError(error) } as const;
    }
  };
}
