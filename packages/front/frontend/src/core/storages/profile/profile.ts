import { METHODS } from "@app/kit";
import { Inject, Service } from "typedi";
import { action, observable } from "mobx";
import { Expose } from "class-transformer";
import { InternalRequestManager, parseServerError, Storage, TokenEntity } from "@app/front-kit";

import { UserEntity } from "core/entities/user";

import { ClientCommonStorage } from "core/storages/client/client-common";

@Service()
export class ProfileStorage extends Storage {
  static token = "ProfileStorage";

  constructor() {
    super();
    this.initStorage(ProfileStorage.token);
  }

  @Inject() private requestManager!: InternalRequestManager;
  @Inject() private clientCommonStorage!: ClientCommonStorage;

  @observable @Expose() acceptLanguage!: string;

  @observable @Expose() user: UserEntity = null!;

  @action setAcceptLanguage = (acceptLanguage: string) => (this.acceptLanguage = acceptLanguage);

  @action login = async (email: string, password: string) => {
    try {
      await this.requestManager.createRequest({
        url: "/auth/authorize-by-email",
        method: METHODS.POST,
      })({ body: { email, password, clientId: this.clientCommonStorage.client.id }, disableErrorMiddlewares: true });
      return { success: true, error: null } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action refreshToken = async () => {
    try {
      const token = await this.requestManager.createRequest({
        url: "/auth/refresh",
        method: METHODS.POST,
        serverDataEntityDecoder: TokenEntity,
      })({ disableErrorMiddlewares: true });
      return { success: true, token } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action loadProfile = async () => {
    try {
      this.user = await this.requestManager.createRequest({
        url: "/users/profile",
        method: METHODS.GET,
        serverDataEntityDecoder: UserEntity,
      })();
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action logout = async () => {
    try {
      await this.requestManager.createRequest({ url: "/auth/logout", method: METHODS.POST })();
      return true;
    } catch (error) {
      return false;
    }
  };

  @action resetPasswordInitial = async (email: string) => {
    try {
      await this.requestManager.createRequest({
        url: "/users/reset-password/initial",
        method: METHODS.POST,
      })({ body: { email, clientId: this.clientCommonStorage.client.id }, disableErrorMiddlewares: true });
      return { success: true, error: null } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action resetPasswordFinish = async (token: string, password: string) => {
    try {
      await this.requestManager.createRequest({
        url: "/users/reset-password/finish",
        method: METHODS.POST,
      })({ body: { token, password }, disableErrorMiddlewares: true });
      return { success: true, error: null } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };
}
