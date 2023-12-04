import { AsyncLocalStorage } from "node:async_hooks";

import { AuthUserEntity } from "types/express";

export const currentUserStorage = new AsyncLocalStorage<AuthUserEntity>();

export function getCurrentUser() {
  return currentUserStorage.getStore()!;
}

export const emptyCurrentUserStorageValue: AuthUserEntity = {
  userId: null!,
  role: null!,
  clientId: null!,
  clientSubscriptionActive: null!,
  clientReadOnlyMode: null!,
};
