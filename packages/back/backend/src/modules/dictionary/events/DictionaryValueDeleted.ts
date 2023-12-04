import { DictionaryTypes } from "@app/shared-enums";

export class DictionaryValueDeleted {
  static eventName = "dictionary.value.deleted";

  constructor(
    public payload: {
      dictionaryType: DictionaryTypes;
      dictionaryValueId: string;
      replaceDictionaryValueKey: string | null;
    },
  ) {}
}
