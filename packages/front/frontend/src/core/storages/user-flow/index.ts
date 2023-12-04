import { entityGetter, METHODS } from "@app/kit";
import { Inject, Service } from "typedi";
import { action, observable } from "mobx";
import { InternalRequestManager, parseServerError, Storage } from "@app/front-kit";

import { arrayOfUserFlowEntities, UserFlowEntity } from "core/entities/userFlow/userFlow";
import { IdEntity } from "core/entities/id";

import { EditUserFlowEntity } from "./entities/EditUserFlow";

@Service()
export class UserFlowStorage extends Storage {
  static token = "UserFlowStorage";

  constructor() {
    super();
    this.initStorage(UserFlowStorage.token);
  }

  @Inject() private requestManager!: InternalRequestManager;

  @observable userFlows: UserFlowEntity[] = [];

  @action loadUserFlow = async () => {
    try {
      const { array } = await this.requestManager.createRequest({
        url: "/user-flow",
        method: METHODS.GET,
        serverDataEntityDecoder: arrayOfUserFlowEntities,
        responseDataFieldPath: ["list"],
      })();
      this.userFlows = array;
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  private async getUserFlow(id: string) {
    return await this.requestManager.createRequest({
      url: "/user-flow/{id}",
      method: METHODS.GET,
      serverDataEntityDecoder: UserFlowEntity,
    })({ urlParams: { id } });
  }

  @action create = async (editEntity: EditUserFlowEntity) => {
    try {
      const { id: userFlowId } = await this.requestManager.createRequest({
        url: "/user-flow",
        method: METHODS.POST,
        serverDataEntityDecoder: IdEntity,
      })({ urlParams: editEntity.apiReady.urlParams, body: editEntity.apiReady.body });
      this.userFlows.splice(0, 0, await this.getUserFlow(userFlowId));
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action update = async (editEntity: EditUserFlowEntity) => {
    const entity = entityGetter(this.userFlows, editEntity.apiReady.urlParams.id, "id");
    if (!entity) return { success: false, error: false } as const;

    try {
      await this.requestManager.createRequest({
        url: "/user-flow/{id}",
        method: METHODS.PATCH,
      })({ urlParams: editEntity.apiReady.urlParams, body: editEntity.apiReady.body });
      this.userFlows[entity.index] = await this.getUserFlow(editEntity.apiReady.urlParams.id);
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action delete = async (id: string) => {
    const entity = entityGetter(this.userFlows, id, "id");
    if (!entity) return { success: false, error: false } as const;
    try {
      await this.requestManager.createRequest({
        url: "/user-flow/{id}",
        method: METHODS.DELETE,
      })({ urlParams: { id } });
      this.userFlows.splice(entity.index, 1);
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };
}
