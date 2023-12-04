import { Service, Inject } from "typedi";
import { IntlDate } from "@worksolutions/utils";
import { Storage } from "@app/front-kit";

import { ProfileStorage } from "core/storages/profile/profile";

import { europeDateFormats } from "./dateFormats";

@Service()
export class IntlDateStorage extends Storage {
  static createIntlDate(language: string) {
    return new IntlDate({ languageCode: language, matchDateModeAndLuxonTypeLiteral: europeDateFormats });
  }

  static token = "intlDateStorage";

  constructor() {
    super();
    this.initStorage(IntlDateStorage.token);
  }

  @Inject() private profileStorage!: ProfileStorage;

  getIntlDate = () => IntlDateStorage.createIntlDate(this.profileStorage.acceptLanguage);
}
