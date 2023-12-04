import { METHODS } from "@app/kit";
import { Inject, Service } from "typedi";
import { action, observable } from "mobx";
import { Expose } from "class-transformer";
import { InternalRequestManager, parseServerError, Storage } from "@app/front-kit";
import { FileInterface } from "@worksolutions/utils";

import { arrayOfClientNotificationEntitiesDecoder, ClientEntity, ClientStorageEntity } from "core/entities/client";
import { EditableFileEntity, FileEntity } from "core/entities/file";

import { updateFileRequest } from "core/storages/_common/updateFile";

import { EditClientEntity } from "./entities/EditClient";

@Service()
export class ClientCommonStorage extends Storage {
  static token = "ClientCommonStorage";

  constructor() {
    super();
    this.initStorage(ClientCommonStorage.token);
  }

  @Inject() private requestManager!: InternalRequestManager;

  @observable @Expose() client: ClientEntity = null!;

  @action loadClient = async (domain: string) => {
    try {
      const storage = this.client?.storage;
      this.client = await this.requestManager.createRequest({
        url: "/clients/tenant",
        method: METHODS.GET,
        serverDataEntityDecoder: ClientEntity,
      })({ body: { domain } });
      if (storage) this.client.storage = storage;
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action loadCurrentClientNotifications = async () => {
    try {
      const { array: notifications } = await this.requestManager.createRequest({
        url: "/clients/notifications",
        method: METHODS.GET,
        serverDataEntityDecoder: arrayOfClientNotificationEntitiesDecoder,
        responseDataFieldPath: ["list"],
      })();
      this.client.notifications = notifications;
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action reloadClient = async () => {
    if (!this.client) return;
    await this.loadClient(this.client.domain);
  };

  @action updateCurrentClient = async (entity: EditClientEntity) => {
    try {
      await this.requestManager.createRequest({
        url: "/clients/current",
        method: METHODS.PATCH,
      })({ body: entity.apiUpdateReady });
      await this.reloadClient();
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action currentClientUploadLogo = async (file: FileInterface) => {
    try {
      const uploadResult = await updateFileRequest(null, EditableFileEntity.build(file), {
        uploadFile: (body) =>
          this.requestManager.createRequest({
            url: "/clients/current/logo",
            method: METHODS.POST,
            serverDataEntityDecoder: FileEntity,
          })({ body }),
      });
      await this.reloadClient();
      return { success: true, uploadResult } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action currentClientDeleteLogo = async () => {
    try {
      await this.requestManager.createRequest({ url: "/clients/current/logo", method: METHODS.DELETE })();
      await this.reloadClient();
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action loadCurrentClientStorage = async () => {
    try {
      this.client.storage = await this.requestManager.createRequest({
        url: "/clients/current/storage-info",
        method: METHODS.GET,
        serverDataEntityDecoder: ClientStorageEntity,
      })();
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action recreateElasticIndexes = async () => {
    try {
      await this.requestManager.createRequest({
        url: "/elastic/recreate-indexes",
        method: METHODS.POST,
      })();
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };
}
