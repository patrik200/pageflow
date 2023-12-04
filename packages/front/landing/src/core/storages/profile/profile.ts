import { Service } from "typedi";
import { action, observable } from "mobx";
import { Expose } from "class-transformer";
import { Storage } from "@app/front-kit";

@Service()
export class ProfileStorage extends Storage {
  static token = "ProfileStorage";

  constructor() {
    super();
    this.initStorage(ProfileStorage.token);
  }

  @observable @Expose() acceptLanguage!: string;

  @action setAcceptLanguage = (acceptLanguage: string) => (this.acceptLanguage = acceptLanguage);
}
