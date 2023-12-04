import { METHODS } from "@app/kit";
import { Inject, Service } from "typedi";
import { action, observable } from "mobx";
import { InternalRequestManager, parseServerError, Storage } from "@app/front-kit";
import { Expose, Type } from "class-transformer";

import { arrayOfUserEntitiesDecoder, UserEntity } from "core/entities/user";

@Service()
export class AllUsersStorage extends Storage {
  static token = "AllUsersStorage";

  constructor() {
    super();
    this.initStorage(AllUsersStorage.token);
  }

  @Inject() private requestManager!: InternalRequestManager;

  @observable @Expose() @Type(() => UserEntity) allUsers: UserEntity[] = [];

  @action loadAllUsers = async () => {
    try {
      const { array } = await this.requestManager.createRequest({
        url: "/users/list",
        method: METHODS.GET,
        responseDataFieldPath: ["list"],
        serverDataEntityDecoder: arrayOfUserEntitiesDecoder,
      })();
      this.allUsers = array;
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };
}
