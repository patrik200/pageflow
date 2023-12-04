import { METHODS } from "@app/kit";
import { Inject, Service } from "typedi";
import { action, observable } from "mobx";
import { InternalRequestManager, parseServerError, Storage } from "@app/front-kit";
import { Expose, Type } from "class-transformer";

import { arrayOfUserEntitiesDecoder, UserEntity } from "core/entities/user";

import { UsersListFiltersEntity } from "./entities/Filter";

@Service()
export class UsersListStorage extends Storage {
  static token = "UsersListStorage";

  constructor() {
    super();
    this.initStorage(UsersListStorage.token);
  }

  @Inject() private requestManager!: InternalRequestManager;

  @observable @Expose() @Type(() => UserEntity) users: UserEntity[] = [];

  @action loadUsersList = async (filter: UsersListFiltersEntity) => {
    try {
      const { array } = await this.requestManager.createRequest({
        url: "/users/list",
        method: METHODS.GET,
        responseDataFieldPath: ["list"],
        serverDataEntityDecoder: arrayOfUserEntitiesDecoder,
      })({ body: filter.apiReady });
      this.users = array;
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };
}
