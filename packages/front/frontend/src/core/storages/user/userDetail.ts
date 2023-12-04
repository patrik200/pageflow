import { METHODS } from "@app/kit";
import { Inject, Service } from "typedi";
import { action, observable } from "mobx";
import { InternalRequestManager, parseServerError, Storage } from "@app/front-kit";
import { FileInterface } from "@worksolutions/utils";

import { UserEntity } from "core/entities/user";
import { IdEntity } from "core/entities/id";
import { EditableFileEntity, FileEntity } from "core/entities/file";

import { ProfileStorage } from "core/storages/profile/profile";
import { updateFileRequest } from "core/storages/_common/updateFile";

import { EditUserEntity, EditUserPasswordEntity } from "./entities/EditUser";

@Service()
export class UserDetailStorage extends Storage {
  static token = "UserDetailStorage";

  constructor() {
    super();
    this.initStorage(UserDetailStorage.token);
  }

  @Inject() private requestManager!: InternalRequestManager;
  @Inject() private profileStorage!: ProfileStorage;

  @observable user: UserEntity | null = null;

  isCurrentUser(userId: string) {
    return userId === this.profileStorage.user.id;
  }

  @action loadUser = async (userId: string) => {
    try {
      this.user = await this.requestManager.createRequest({
        url: "/users/{userId}/profile",
        method: METHODS.GET,
        serverDataEntityDecoder: UserEntity,
      })({ urlParams: { userId } });
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action updateUser = async (entity: EditUserEntity) => {
    try {
      await this.requestManager.createRequest({ url: "/users/{userId}/profile", method: METHODS.PATCH })({
        urlParams: { userId: entity.user!.id },
        body: entity.apiUpdateReady,
      });
      if (this.isCurrentUser(entity.user!.id)) await this.profileStorage.loadProfile();
      return await this.loadUser(entity.user!.id);
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action updateUserPassword = async (entity: EditUserPasswordEntity) => {
    try {
      await this.requestManager.createRequest({ url: "/users/{userId}/profile", method: METHODS.PATCH })({
        urlParams: { userId: entity.user!.id },
        body: entity.apiSaveReady,
      });
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action createUser = async (entity: EditUserEntity) => {
    try {
      const { id } = await this.requestManager.createRequest({
        url: "/users/create",
        method: METHODS.POST,
        serverDataEntityDecoder: IdEntity,
      })({
        body: entity.apiCreateReady,
      });
      return { success: true, id } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action deleteUser = async (userId: string) => {
    try {
      await this.requestManager.createRequest({ url: "/users/{userId}", method: METHODS.DELETE })({
        urlParams: { userId },
      });
      if (this.isCurrentUser(userId)) await this.profileStorage.loadProfile();
      return await this.loadUser(userId);
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action restoreUser = async (userId: string) => {
    try {
      await this.requestManager.createRequest({ url: "/users/{userId}/restore", method: METHODS.POST })({
        urlParams: { userId },
      });
      if (this.isCurrentUser(userId)) await this.profileStorage.loadProfile();
      return await this.loadUser(userId);
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action uploadAvatar = async (userId: string, file: FileInterface) => {
    try {
      const uploadResult = await updateFileRequest(null, EditableFileEntity.build(file), {
        uploadFile: (body) =>
          this.requestManager.createRequest({
            url: "/users/{userId}/profile/avatar",
            method: METHODS.POST,
            serverDataEntityDecoder: FileEntity,
          })({ urlParams: { userId }, body }),
      });

      if (this.isCurrentUser(userId)) await this.profileStorage.loadProfile();
      await this.loadUser(userId);

      return { success: true, uploadResult } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action deleteAvatar = async (userId: string) => {
    try {
      await this.requestManager.createRequest({ url: "/users/{userId}/profile/avatar", method: METHODS.DELETE })({
        urlParams: { userId },
      });
      if (this.isCurrentUser(userId)) await this.profileStorage.loadProfile();
      return await this.loadUser(userId);
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };
}
